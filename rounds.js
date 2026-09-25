// rounds.js — Bomb Squad Scenario Dataset
// High-tension bomb defusal scenarios with deterministic correct wires

const ROUND_POOL = [
  {
    id: "r01",
    clue: "Timer reads 00:04. The red wire runs straight into the display. The blue wire has a faint hum. The yellow wire is spliced twice. The purple wire is loose, barely making contact.",
    options: {
      red: "Connects directly to the timer display",
      blue: "Faint electrical hum, slightly warm",
      yellow: "Spliced twice, uneven insulation",
      purple: "Loose, barely making contact"
    },
    correct: "purple"
  },
  {
    id: "r02",
    clue: "Casing is labeled 'MK-7'. Blue wire is brand new. Red wire matches the casing's manufacture batch. Yellow wire was added later, different gauge. Purple wire has a manufacturer seal on it.",
    options: {
      blue: "Brand new, no wear",
      red: "Matches the casing's original batch",
      yellow: "Different gauge, added later",
      purple: "Still has a manufacturer seal"
    },
    correct: "purple"
  },
  {
    id: "r03",
    clue: "A field note reads: 'Cut the loudest frequency.' Red clicks faintly. Blue buzzes steadily at 60Hz. Yellow is completely silent. Purple pulses once per second.",
    options: {
      red: "Faint clicking mechanism",
      blue: "Steady 60Hz electromagnetic buzzing",
      yellow: "Completely silent",
      purple: "Pulses once per second"
    },
    correct: "blue"
  },
  {
    id: "r04",
    clue: "Three wires loop back into the detonator casing; only one runs directly to the primary 9V battery cell. Standard EOD manual: isolate power first.",
    options: {
      red: "Loops back into detonator block",
      blue: "Loops back into detonator block",
      yellow: "Runs straight to the primary 9V battery cell",
      purple: "Loops back into detonator block"
    },
    correct: "yellow"
  },
  {
    id: "r05",
    clue: "Thermal imaging shows heat dissipation near only one lead, indicating active detonator current. Red, yellow, and purple are room temperature. Blue reads 38°C.",
    options: {
      red: "Ambient room temperature (21°C)",
      blue: "Warm to touch (38°C current flow)",
      yellow: "Ambient room temperature (21°C)",
      purple: "Ambient room temperature (21°C)"
    },
    correct: "blue"
  },
  {
    id: "r06",
    clue: "Standard protocol: cut the wire that does NOT match the bomb chassis color (steel grey). Red is bright crimson. Blue is steel grey. Yellow is safety amber. Purple is violet.",
    options: {
      red: "Bright crimson, high contrast",
      blue: "Steel grey, matches chassis anodization",
      yellow: "Safety amber, high contrast",
      purple: "Violet, high contrast"
    },
    correct: "blue"
  },
  {
    id: "r07",
    clue: "UV blacklight sweep reveals a fluorescent 'X' stencil stamped on one wire's jacket by the bomb technician who planted the training decoy.",
    options: {
      red: "No fluorescence under blacklight",
      blue: "No fluorescence under blacklight",
      yellow: "Fluorescent 'X' stencil glowing bright yellow",
      purple: "No fluorescence under blacklight"
    },
    correct: "yellow"
  },
  {
    id: "r08",
    clue: "The device was assembled by a left-handed operator — forensic tell is the single lead routed strictly from the left chassis wall.",
    options: {
      red: "Enters casing from the right wall",
      blue: "Enters casing from the top lid",
      yellow: "Enters casing from the far left wall",
      purple: "Enters casing from the bottom base"
    },
    correct: "yellow"
  },
  {
    id: "r09",
    clue: "Capacitor discharge warning: cutting an energized lead with high resistance causes instant arc detonation. Cut the zero-resistance ground trace.",
    options: {
      red: "High resistance bridge (470 kOhm)",
      blue: "Medium resistance resistor (10 kOhm)",
      yellow: "High capacitive impedance",
      purple: "Solid copper ground bus, zero resistance"
    },
    correct: "purple"
  },
  {
    id: "r10",
    clue: "A mercury tilt switch is actively balancing on a copper plate. Only the red wire holds mechanical tension against the tilt tube.",
    options: {
      red: "Taut wire keeping mercury switch horizontal",
      blue: "Slack wire coiled loosely",
      yellow: "Slack wire hanging free",
      purple: "Slack wire taped to side"
    },
    correct: "red"
  },
  {
    id: "r11",
    clue: "Anti-tamper circuit: cutting any wire carrying >12V trips the relay. Only one wire has zero voltage (dead test trace).",
    options: {
      red: "Multimeter reads 12.4V",
      blue: "Multimeter reads 0.0V (dead trace)",
      yellow: "Multimeter reads 12.2V",
      purple: "Multimeter reads 11.9V"
    },
    correct: "blue"
  },
  {
    id: "r12",
    clue: "The bomb technician radioed: 'Cut the stripped wire before it touches the aluminum foil plate!'",
    options: {
      red: "Fully jacketed with thick vinyl",
      blue: "Braided nylon sleeve",
      yellow: "Double insulated heat-shrink",
      purple: "Stripped bare copper, 2mm above aluminum foil"
    },
    correct: "purple"
  },
  {
    id: "r13",
    clue: "Digital oscillator scope shows a high-frequency square wave driving the countdown buzzer. Cutting the clock pulse halts the sequence.",
    options: {
      red: "5V 1kHz square wave clock signal",
      blue: "Constant flat DC baseline",
      yellow: "Low amplitude 60Hz ripple",
      purple: "Unconnected floating lead"
    },
    correct: "red"
  },
  {
    id: "r14",
    clue: "The defusal schematic states: 'Rule of Oddities: Snip the only stranded wire; solid core leads will snap the microswitch.'",
    options: {
      red: "Solid core copper 18 AWG",
      blue: "Solid core copper 18 AWG",
      yellow: "Multi-strand flexible copper 22 AWG",
      purple: "Solid core copper 18 AWG"
    },
    correct: "yellow"
  },
  {
    id: "r15",
    clue: "Optical sensor active: a photocell is measuring ambient light. Cut the trace supplying power to the photocell LED to blind the trigger.",
    options: {
      red: "Feeds the optical sensor LED emitter",
      blue: "Runs to mechanical striker",
      yellow: "Connects buzzer horn",
      purple: "Ground bridge"
    },
    correct: "red"
  },
  {
    id: "r16",
    clue: "Defective solder joint detected: one lead has a cracked, oxidized solder ball that will fall apart upon cutting without triggering the latch.",
    options: {
      red: "Fresh, shiny concaved solder joint",
      blue: "Pristine factory solder pad",
      yellow: "Cracked, brittle cold solder joint with grey oxidation",
      purple: "Epoxy potted terminal connection"
    },
    correct: "yellow"
  },
  {
    id: "r17",
    clue: "Radio detonator receiver: the remote trigger depends on an external RF antenna wire. Sever the antenna to jam the signal.",
    options: {
      red: "Tied to ground plane",
      blue: "Runs to detonator cap",
      yellow: "Connects power rail",
      purple: "Extends outside casing as an unshielded antenna wire"
    },
    correct: "purple"
  },
  {
    id: "r18",
    clue: "Barometric fuse armed for altitude drop. The pressure transducer bypass lead is color-coded by the international explosive ordnance disposal guide (Crimson Red).",
    options: {
      red: "Crimson red labeled 'EOD BYPASS'",
      blue: "Cobalt blue labeled 'SENSOR IN'",
      yellow: "Canary yellow labeled 'DET HIGH'",
      purple: "Deep violet labeled 'ALARM'"
    },
    correct: "red"
  },
  {
    id: "r19",
    clue: "Magnetic reed switch triggered by an external neodymium magnet. Sever the coil holding the magnetic latch closed.",
    options: {
      red: "Powers the electromagnetic latch coil",
      blue: "Runs to secondary indicator LED",
      yellow: "Terminal test point",
      purple: "Battery negative return"
    },
    correct: "red"
  },
  {
    id: "r20",
    clue: "Wire crimp inspection: three wires have professional military-spec crimps; one wire is hastily hand-twisted together with electrical tape.",
    options: {
      red: "Gold-plated barrel crimp",
      blue: "Hand-twisted copper exposed under black tape",
      yellow: "Mil-spec heat-sealed terminal",
      purple: "Machine-crimped spade connector"
    },
    correct: "blue"
  },
  {
    id: "r21",
    clue: "The bomb disposal guide notes: 'Cut the wire with the striped stripe jacket to isolate the timing crystal.'",
    options: {
      red: "Solid crimson matte finish",
      blue: "Solid cobalt glossy jacket",
      yellow: "Yellow with black helical stripe",
      purple: "Solid purple silicone jacket"
    },
    correct: "yellow"
  },
  {
    id: "r22",
    clue: "Failsafe relay loop: cutting the energized loop trips the relay. Cut the de-energized secondary jumper.",
    options: {
      red: "Energized loop (current clamp reads 250mA)",
      blue: "Energized loop (current clamp reads 250mA)",
      yellow: "Energized loop (current clamp reads 250mA)",
      purple: "De-energized secondary jumper (0mA current)"
    },
    correct: "purple"
  },
  {
    id: "r23",
    clue: "Audio listening cone placed on device: a ticking gear movement is located directly beneath the red wire anchor point. Severing it stops the escapement wheel.",
    options: {
      red: "Anchored directly to the clockwork gear movement",
      blue: "Suspended over electronic PCB",
      yellow: "Attached to battery bracket",
      purple: "Anchored to chassis wall"
    },
    correct: "red"
  },
  {
    id: "r24",
    clue: "The manufacturer's warning label states: 'SERVICING: Cut yellow lead to reset microcontroller without triggering pyrotechnic squib.'",
    options: {
      red: "Connected to primary squib",
      blue: "Connected to backup squib",
      yellow: "Microcontroller reset line (RST PIN 1)",
      purple: "Connected to tamper switch"
    },
    correct: "yellow"
  },
  {
    id: "r25",
    clue: "Chemical timer vial: an acid vial is dripping toward an actuator wire. Cut the wire before the acid burns through the protective nylon coating.",
    options: {
      red: "Clear of the acid drip path",
      blue: "Directly in the path of the chemical drip",
      yellow: "Clear of the acid drip path",
      purple: "Clear of the acid drip path"
    },
    correct: "blue"
  },
  {
    id: "r26",
    clue: "Galvanometer check: a minute galvanic current is leaking from an improperly grounded wire terminal.",
    options: {
      red: "Galvanometer reads zero leakage",
      blue: "Galvanometer reads zero leakage",
      yellow: "Galvanometer reads zero leakage",
      purple: "Galvanometer needle deflects sharply (+45uA leakage)"
    },
    correct: "purple"
  },
  {
    id: "r27",
    clue: "A cryptic cipher scratched into the bomb lid reads: 'The color of royal robes holds the spark of life.'",
    options: {
      red: "Crimson dye lead",
      blue: "Navy blue lead",
      yellow: "Ochre yellow lead",
      purple: "Royal purple lead connected to power terminal"
    },
    correct: "purple"
  },
  {
    id: "r28",
    clue: "Laser tripwire bomb: the photo-receiver signal wire must be cut while the beam is unbroken to prevent interruption detection.",
    options: {
      red: "Powers the laser diode",
      blue: "Carries the photo-receiver circuit signal",
      yellow: "Chassis ground bond",
      purple: "Buzzer alarm line"
    },
    correct: "blue"
  },
  {
    id: "r29",
    clue: "Dual detonator setup: the master arming lead has a double-thickness outer jacket to withstand heat.",
    options: {
      red: "Heavy-duty double-thickness silicone jacket",
      blue: "Ultra-thin single-layer lead",
      yellow: "Standard vinyl hookup wire",
      purple: "Bare uninsulated bridge"
    },
    correct: "red"
  },
  {
    id: "r30",
    clue: "Electronic tamper plate: one wire is caught in the lid's pinch hinge and about to be severed by opening the box. Snip it cleanly first.",
    options: {
      red: "Clear of the lid hinge",
      blue: "Pinched in the sharp metal lid hinge mechanism",
      yellow: "Clear of the lid hinge",
      purple: "Clear of the lid hinge"
    },
    correct: "blue"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROUND_POOL };
}
