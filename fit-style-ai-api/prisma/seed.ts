import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PLACEHOLDER = {
  top: "https://picsum.photos/seed/fit-top-m-1/400/500",
  bottom: "https://picsum.photos/seed/fit-bottom-m-1/400/500",
  outer: "https://picsum.photos/seed/fit-outer-m-1/400/500",
  shoes: "https://picsum.photos/seed/fit-shoes-m-1/400/500",
}

async function main() {
  const codes = [
    { code: "SLIM", labelKo: "슬림", sortOrder: 1 },
    { code: "REGULAR", labelKo: "보통", sortOrder: 2 },
    { code: "UPPER", labelKo: "상체 볼륨", sortOrder: 3 },
    { code: "LOWER", labelKo: "하체 볼륨", sortOrder: 4 },
    { code: "BALANCED", labelKo: "균형", sortOrder: 5 },
  ] as const

  const bodyTypes: { id: number; code: string }[] = []
  for (const row of codes) {
    const bt = await prisma.bodyType.upsert({
      where: { code: row.code },
      create: row,
      update: { labelKo: row.labelKo, sortOrder: row.sortOrder },
    })
    bodyTypes.push(bt)
  }

  const top = await prisma.item.upsert({
    where: { id: BigInt(1) },
    create: {
      id: BigInt(1),
      category: "TOP",
      gender: "M",
      title: "데일리 니트 (샘플)",
      imageUrl: PLACEHOLDER.top,
      isActive: true,
    },
    update: { imageUrl: PLACEHOLDER.top, title: "데일리 니트 (샘플)" },
  })

  const bottom = await prisma.item.upsert({
    where: { id: BigInt(2) },
    create: {
      id: BigInt(2),
      category: "BOTTOM",
      gender: "M",
      title: "스트레이트 데님 (샘플)",
      imageUrl: PLACEHOLDER.bottom,
      isActive: true,
    },
    update: { imageUrl: PLACEHOLDER.bottom },
  })

  const outer = await prisma.item.upsert({
    where: { id: BigInt(3) },
    create: {
      id: BigInt(3),
      category: "OUTER",
      gender: "M",
      title: "숏 패딩 (샘플)",
      imageUrl: PLACEHOLDER.outer,
      isActive: true,
    },
    update: { imageUrl: PLACEHOLDER.outer },
  })

  const shoes = await prisma.item.upsert({
    where: { id: BigInt(4) },
    create: {
      id: BigInt(4),
      category: "SHOES",
      gender: "M",
      title: "스니커즈 (샘플)",
      imageUrl: PLACEHOLDER.shoes,
      isActive: true,
    },
    update: { imageUrl: PLACEHOLDER.shoes },
  })

  await prisma.outfitSet.upsert({
    where: { code: "M-CASUAL-001" },
    create: {
      code: "M-CASUAL-001",
      nameKo: "데일리 캐주얼 (샘플)",
      gender: "M",
      season: "WINTER",
      topId: top.id,
      bottomId: bottom.id,
      outerId: outer.id,
      shoesId: shoes.id,
      priority: 10,
      summaryKo: "보통 체형에 맞춰 균형 잡힌 실루엣으로 구성한 캐주얼 룩입니다.",
      isActive: true,
      bodyTypes: {
        connect: [{ code: "REGULAR" }, { code: "BALANCED" }],
      },
    },
    update: {
      nameKo: "데일리 캐주얼 (샘플)",
      summaryKo: "보통 체형에 맞춰 균형 잡힌 실루엣으로 구성한 캐주얼 룩입니다.",
    },
  })

  console.log("Seed OK — body types:", bodyTypes.length, "sample outfit: M-CASUAL-001")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
