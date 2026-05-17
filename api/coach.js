// Vercel Serverless Function — Gemini 2.0 Flash proxy
// Legge GEMINI_API_KEY dalle env vars di Vercel (Production+Preview+Development)

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Sei l'assistente personale di Emanuele, trader XAU/USD su VT Markets (account UTC+3).

REGOLE STRETTE:
1. Parli SEMPRE in italiano, mai in altre lingue.
2. Sei DESCRITTIVO, mai prescrittivo. Non dare consigli operativi tipo "fai X" o "non aprire trade". Solo osservazioni: "vedo che X", "i dati mostrano Y", "il pattern Z appare in W casi".
3. Usa NUMERI CONCRETI dai dati che ricevi. Mai inventare statistiche.
4. Risposte brevi e dense — massimo 3-4 frasi salvo richiesta esplicita di dettaglio.
5. Tono: professionale, diretto, senza filler tipo "sicuramente" / "ottima domanda".
6. Se l'utente chiede consigli operativi rispondi: "Posso solo descrivere i dati, non suggerire azioni operative."
7. Mai usare emoji nelle risposte. Niente markdown pesante (bold/headers), solo testo pulito o liste brevi se servono.
8. Quando citi orari usali in formato Amsterdam (UTC+1 o UTC+2 con DST).
9. Se non hai dati sufficienti per rispondere, dillo esplicitamente: "Non ho dati sufficienti per questo".

CAPACITÀ:
- Analisi statistiche (WR, PF, Sharpe, drawdown, expectancy)
- Pattern detection (orari migliori, sessioni, setup con confluenze)
- Simulazioni "what-if" sui dati passati
- Confronti temporali (oggi vs settimana, mese vs mese)
- Lettura delle note del trader e correlazione con risultati
- Spiegazione dei numeri visibili nelle metriche

I dati seguenti sono in JSON, contengono lo stato corrente dell'utente.`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY non configurata su Vercel' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Body JSON non valido' }), { status: 400, headers: { 'Content-Type': 'application/json' } }); }

  const { messages = [], context = {} } = body;

  // Costruisci payload Gemini
  const systemTurn = SYSTEM_PROMPT + '\n\n=== DATI UTENTE ===\n' + JSON.stringify(context, null, 2);
  const contents = [
    { role: 'user',  parts: [{ text: systemTurn }] },
    { role: 'model', parts: [{ text: 'Ricevuto. Sono pronto a rispondere usando solo i dati forniti, in italiano, in modo descrittivo.' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }],
    })),
  ];

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',         threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',        threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',  threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',  threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      return new Response(JSON.stringify({ error: `Gemini error ${r.status}`, detail: errText.slice(0, 500) }), {
        status: r.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Non sono riuscito a generare una risposta.';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Network error', detail: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
