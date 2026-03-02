import { Firestore, Timestamp } from "firebase-admin/firestore";

export type DemoTemplate = "restaurant" | "store" | "services";

type SeedContext = {
  db: Firestore;
  demoGroupId: string;
  now: Timestamp;
};

function categoriesCollectionPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/categories`;
}

function productsCollectionPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/products`;
}

function ordersCollectionPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/orders`;
}

function leadsCollectionPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/leads`;
}

function settingsDocPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/settings/main`;
}

function metaDocPath(demoGroupId: string) {
  return `demoGroups/${demoGroupId}/meta/main`;
}

async function seedRestaurant(input: SeedContext) {
  const { db, demoGroupId, now } = input;
  const batch = db.batch();
  const categories = [
    { id: "cat-entradas", name: "Entradas", order: 1 },
    { id: "cat-fondos", name: "Fondos", order: 2 },
    { id: "cat-bebidas", name: "Bebidas", order: 3 },
  ];

  categories.forEach((category) => {
    batch.set(db.doc(`${categoriesCollectionPath(demoGroupId)}/${category.id}`), {
      ...category,
      createdAt: now,
      updatedAt: now,
    });
  });

  for (let index = 1; index <= 12; index += 1) {
    const categoryId =
      index <= 4 ? "cat-entradas" : index <= 9 ? "cat-fondos" : "cat-bebidas";
    batch.set(db.doc(`${productsCollectionPath(demoGroupId)}/prod-${index}`), {
      id: `prod-${index}`,
      categoryId,
      name: `Plato demo ${index}`,
      price: 14 + index,
      stock: 40,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  }

  for (let index = 1; index <= 10; index += 1) {
    batch.set(db.doc(`${ordersCollectionPath(demoGroupId)}/ord-${index}`), {
      id: `ord-${index}`,
      code: `R-${1000 + index}`,
      channel: "whatsapp",
      status: index <= 4 ? "pending" : "completed",
      total: 32 + index * 3,
      createdAt: now,
      updatedAt: now,
    });
  }

  batch.set(db.doc(settingsDocPath(demoGroupId)), {
    template: "restaurant",
    currency: "PEN",
    whatsapp: "51919662011",
    primaryColor: "#f59e0b",
    updatedAt: now,
  });
  batch.set(db.doc(metaDocPath(demoGroupId)), {
    seededAt: now,
    seedVersion: 1,
    template: "restaurant",
  });

  await batch.commit();
}

async function seedStore(input: SeedContext) {
  const { db, demoGroupId, now } = input;
  const batch = db.batch();
  const categories = [
    { id: "cat-destacados", name: "Destacados", order: 1 },
    { id: "cat-moda", name: "Moda", order: 2 },
    { id: "cat-hogar", name: "Hogar", order: 3 },
    { id: "cat-tech", name: "Tech", order: 4 },
  ];

  categories.forEach((category) => {
    batch.set(db.doc(`${categoriesCollectionPath(demoGroupId)}/${category.id}`), {
      ...category,
      createdAt: now,
      updatedAt: now,
    });
  });

  for (let index = 1; index <= 18; index += 1) {
    const categoryId =
      index <= 5
        ? "cat-destacados"
        : index <= 10
          ? "cat-moda"
          : index <= 14
            ? "cat-hogar"
            : "cat-tech";
    batch.set(db.doc(`${productsCollectionPath(demoGroupId)}/prod-${index}`), {
      id: `prod-${index}`,
      categoryId,
      name: `Producto demo ${index}`,
      price: 39 + index * 2,
      stock: 55,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  }

  for (let index = 1; index <= 8; index += 1) {
    batch.set(db.doc(`${ordersCollectionPath(demoGroupId)}/ord-${index}`), {
      id: `ord-${index}`,
      code: `S-${2000 + index}`,
      channel: "store",
      status: index <= 3 ? "pending" : "completed",
      total: 78 + index * 7,
      createdAt: now,
      updatedAt: now,
    });
  }

  batch.set(db.doc(settingsDocPath(demoGroupId)), {
    template: "store",
    currency: "PEN",
    whatsapp: "51919662011",
    deliveryEnabled: true,
    updatedAt: now,
  });
  batch.set(db.doc(metaDocPath(demoGroupId)), {
    seededAt: now,
    seedVersion: 1,
    template: "store",
  });

  await batch.commit();
}

async function seedServices(input: SeedContext) {
  const { db, demoGroupId, now } = input;
  const batch = db.batch();
  const pipeline = ["Nuevo", "Contactado", "Propuesta", "Cerrado"];

  for (let index = 1; index <= 12; index += 1) {
    const stage = pipeline[index % pipeline.length];
    batch.set(db.doc(`${leadsCollectionPath(demoGroupId)}/lead-${index}`), {
      id: `lead-${index}`,
      name: `Lead demo ${index}`,
      service: index % 2 === 0 ? "Landing" : "Consultoria",
      stage,
      source: "ads",
      createdAt: now,
      updatedAt: now,
    });
  }

  batch.set(db.doc(settingsDocPath(demoGroupId)), {
    template: "services",
    pipelineStages: pipeline,
    whatsapp: "51919662011",
    updatedAt: now,
  });
  batch.set(db.doc(metaDocPath(demoGroupId)), {
    seededAt: now,
    seedVersion: 1,
    template: "services",
  });

  await batch.commit();
}

export async function seedDemoTemplate(input: {
  db: Firestore;
  demoGroupId: string;
  template: DemoTemplate;
}) {
  const now = Timestamp.now();
  if (input.template === "restaurant") {
    await seedRestaurant({ db: input.db, demoGroupId: input.demoGroupId, now });
    return;
  }
  if (input.template === "store") {
    await seedStore({ db: input.db, demoGroupId: input.demoGroupId, now });
    return;
  }
  await seedServices({ db: input.db, demoGroupId: input.demoGroupId, now });
}

export const DEMO_SUBCOLLECTIONS = [
  "categories",
  "products",
  "orders",
  "leads",
  "settings",
  "meta",
] as const;
