// Mock PC component catalog for the PC Builder MVP.
// Compatibility here is simulated with simple socket/tier matching rules
// so the UI can demonstrate real-time build validation. A future backend
// (Node.js + a proper compatibility engine) can replace `checkCompatibility`
// without touching any component consuming it.

export const componentCatalog = {
  cpu: [
    { id: "cpu-1", name: "Ryzen 5 5600", price: 12999, socket: "AM4", tier: 2, purpose: ["Gaming", "Coding", "Office"] },
    { id: "cpu-2", name: "Ryzen 7 7700X", price: 24999, socket: "AM5", tier: 3, purpose: ["Gaming", "Editing", "Coding"] },
    { id: "cpu-3", name: "Intel Core i5-13400F", price: 15999, socket: "LGA1700", tier: 2, purpose: ["Gaming", "Coding"] },
    { id: "cpu-4", name: "Intel Core i9-14900K", price: 47999, socket: "LGA1700", tier: 4, purpose: ["Editing", "Gaming"] },
    { id: "cpu-5", name: "Ryzen 3 4100", price: 6499, socket: "AM4", tier: 1, purpose: ["Office"] },
  ],
  gpu: [
    { id: "gpu-1", name: "RTX 4060 8GB", price: 27999, tier: 2, purpose: ["Gaming", "Editing"] },
    { id: "gpu-2", name: "RTX 4070 Super 12GB", price: 54999, tier: 3, purpose: ["Gaming", "Editing"] },
    { id: "gpu-3", name: "RTX 4090 24GB", price: 154999, tier: 4, purpose: ["Editing", "Gaming"] },
    { id: "gpu-4", name: "GTX 1650 4GB", price: 12999, tier: 1, purpose: ["Office", "Coding"] },
    { id: "gpu-5", name: "Integrated Graphics", price: 0, tier: 0, purpose: ["Office", "Coding"] },
  ],
  motherboard: [
    { id: "mobo-1", name: "B450M Pro4", price: 5999, socket: "AM4", ramType: "DDR4", purpose: ["Gaming", "Office", "Coding"] },
    { id: "mobo-2", name: "B650 Gaming Plus", price: 13999, socket: "AM5", ramType: "DDR5", purpose: ["Gaming", "Editing"] },
    { id: "mobo-3", name: "B760M DS3H", price: 9999, socket: "LGA1700", ramType: "DDR4", purpose: ["Gaming", "Coding"] },
    { id: "mobo-4", name: "Z790 Aorus Elite", price: 21999, socket: "LGA1700", ramType: "DDR5", purpose: ["Editing", "Gaming"] },
  ],
  ram: [
    { id: "ram-1", name: "8GB DDR4 3200MHz", price: 1799, type: "DDR4", capacity: 8, purpose: ["Office"] },
    { id: "ram-2", name: "16GB DDR4 3200MHz", price: 3299, type: "DDR4", capacity: 16, purpose: ["Gaming", "Coding", "Office"] },
    { id: "ram-3", name: "16GB DDR5 6000MHz", price: 5499, type: "DDR5", capacity: 16, purpose: ["Gaming", "Coding"] },
    { id: "ram-4", name: "32GB DDR5 6000MHz", price: 10999, type: "DDR5", capacity: 32, purpose: ["Editing", "Gaming"] },
  ],
  storage: [
    { id: "sto-1", name: "500GB NVMe SSD", price: 2799, capacity: "500GB", purpose: ["Office", "Coding"] },
    { id: "sto-2", name: "1TB NVMe SSD", price: 4999, capacity: "1TB", purpose: ["Gaming", "Coding"] },
    { id: "sto-3", name: "2TB NVMe SSD", price: 9999, capacity: "2TB", purpose: ["Editing", "Gaming"] },
    { id: "sto-4", name: "1TB HDD", price: 2299, capacity: "1TB", purpose: ["Office"] },
  ],
  psu: [
    { id: "psu-1", name: "450W Bronze", price: 2999, wattage: 450, purpose: ["Office", "Coding"] },
    { id: "psu-2", name: "650W Gold", price: 5499, wattage: 650, purpose: ["Gaming", "Coding"] },
    { id: "psu-3", name: "850W Gold", price: 8499, wattage: 850, purpose: ["Editing", "Gaming"] },
    { id: "psu-4", name: "1000W Platinum", price: 12999, wattage: 1000, purpose: ["Editing", "Gaming"] },
  ],
  cabinet: [
    { id: "cab-1", name: "NZXT-style Airflow Mini", price: 3499, purpose: ["Office", "Coding"] },
    { id: "cab-2", name: "RGB Mesh Mid Tower", price: 4999, purpose: ["Gaming"] },
    { id: "cab-3", name: "Silent Studio Tower", price: 6999, purpose: ["Editing"] },
    { id: "cab-4", name: "Compact ITX Case", price: 5999, purpose: ["Office", "Gaming"] },
  ],
};

export const componentLabels = {
  cpu: "CPU",
  gpu: "GPU",
  motherboard: "Motherboard",
  ram: "RAM",
  storage: "Storage",
  psu: "PSU",
  cabinet: "Cabinet",
};

export const componentOrder = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "cabinet"];

// Estimated wattage draw used to sanity-check the PSU choice.
const gpuDraw = { 0: 60, 1: 170, 2: 220, 3: 320, 4: 450 };
const cpuDraw = { 1: 65, 2: 90, 3: 105, 4: 125 };

export function checkCompatibility(build) {
  const issues = [];
  const warnings = [];
  const { cpu, motherboard, ram, gpu, psu } = build;

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push(`${cpu.name} (${cpu.socket}) does not fit ${motherboard.name} (${motherboard.socket} socket).`);
  }
  if (ram && motherboard && ram.type !== motherboard.ramType) {
    issues.push(`${ram.name} is ${ram.type}, but ${motherboard.name} only supports ${motherboard.ramType}.`);
  }
  if (cpu && gpu && psu) {
    const estimatedDraw = (cpuDraw[cpu.tier] || 65) + (gpuDraw[gpu.tier] || 60) + 80;
    if (psu.wattage < estimatedDraw) {
      issues.push(`${psu.name} may not supply enough power for this build (~${estimatedDraw}W needed).`);
    } else if (psu.wattage < estimatedDraw + 100) {
      warnings.push(`${psu.name} covers this build but leaves little headroom for upgrades.`);
    }
  }
  if (gpu && gpu.tier >= 3 && cpu && cpu.tier <= 1) {
    warnings.push(`${gpu.name} may be bottlenecked by ${cpu.name} in demanding workloads.`);
  }

  if (issues.length > 0) return { status: "incompatible", issues, warnings };
  if (warnings.length > 0) return { status: "warning", issues, warnings };
  const filled = Object.values(build).filter(Boolean).length;
  if (filled === 0) return { status: "empty", issues, warnings };
  return { status: "compatible", issues, warnings };
}
