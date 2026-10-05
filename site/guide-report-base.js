/* Publication-safe editorial layer for the report-style Field Guides. */
window.CA_REPORT = {
  kicker: 'Route Field Guide',
  title: 'Carretera Austral',
  deck: 'What actually happens when you ride it',
  standfirst: [
    'The Carretera Austral is remote, but it is not a 1,200-kilometre wilderness expedition. The route is better understood as a chain of useful towns and service nodes separated by wet mountain roads, changing surfaces, ferry links and increasingly thin mechanical support. The hard parts are usually the interfaces: arriving after a shop closes, finding that a ferry has shifted with the weather, discovering that a small-town mechanic does not stock your specific part, or reaching Villa O’Higgins without enough cash or schedule slack.',
    'This guide is organized around the decisions cyclists repeatedly have to make on the road. It uses dated rider experience for ground truth and current public checks for operators, rules and services. Historical observations stay dated rather than being turned into permanent facts.'
  ],
  keyJudgments: [
    'Plan around service nodes, not around an assumption of continuous wilderness. Puerto Montt/Puerto Varas, Coyhaique and Cochrane are deliberate reset points.',
    'For most riders, two to three days of food capacity and roughly two to three litres of normal water capacity fit the rider evidence better than expedition-size loads; both should be expandable when a specific section warrants it.',
    'Carry small bike-specific parts that a competent local mechanic cannot improvise: derailleur hanger, brake pads, correct spokes and nipples, quick links, rack hardware and proprietary brake or hub parts that could stop the trip.',
    'Treat ferries as separate systems. Hornopirén, Puerto Yungay, Lago O’Higgins and Lago del Desierto have different booking, capacity, payment and weather realities.',
    'If you continue from Villa O’Higgins to El Chaltén, you are no longer doing ordinary road touring. The trip becomes a ferry–border–loaded-bike trail–ferry sequence, and weather slack is part of the route.'
  ],
  parts: []
};
window.CYCLING_GUIDE_REPORTS = {
  routes: {'carretera-austral': window.CA_REPORT},
  countries: {
    CL: {
      kicker: 'Country Field Guide',
      title: 'Cycling in Chile',
      deck: 'Country planning first; ride-specific detail where it belongs',
      standfirst: [
        'Chile is too long and geographically varied for one country page to serve as a substitute for its ride guides. This page is deliberately an orientation hub: use it for country-wide planning, then move into a ride guide for the road surface, water, repair, ferry and place-by-place detail that applies to a specific corridor.',
        'The project’s deepest Chilean evidence is currently the Carretera Austral. Earlier versions of this page allowed those route observations to spill into the national guide, which made Chile read like a pile of Carretera notes. The revised structure keeps country-wide material here and sends route-specific claims back to the Carretera Austral field guide.'
      ],
      keyJudgments: [
        'Use the country page to understand national logistics and choose a ride; use the ride page to plan actual riding days.',
        'Do not generalize Patagonia-specific road, ferry, cash or weather observations to all of Chile.',
        'For southern Chile, Puerto Montt/Puerto Varas and Coyhaique are important service gateways; their detailed role belongs in the Carretera Austral guide rather than being repeated as a national rule.',
        'Time-sensitive transport, border, safety and service information should remain dated and be rechecked close to travel.'
      ],
      parts: []
    }
  }
};