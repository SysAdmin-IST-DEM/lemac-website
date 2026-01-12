import { prisma } from '../../index.js';

export async function addPrintMaterial(name: string, description: string, priceMultiplier: number,
                                       active?: boolean) {
  return prisma.printMaterial.create({
    data: {
      name,
      description,
      priceMultiplier,
      active
    }
  });
}

export async function getPrintMaterials() {
  return prisma.printMaterial.findMany();
}

export async function editPrintMaterial(id: number, name?: string, description?: string, priceMultiplier?: number,
                                       active?: boolean) {
  return prisma.printMaterial.update({
    where: {
      id
    },
    data: {
      name,
      description,
      priceMultiplier,
      active
    }
  });
}

export async function deletePrintMaterial(id: number) {
  return prisma.printMaterial.delete({
    where: {
      id
    }
  });
}