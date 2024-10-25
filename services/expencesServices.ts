interface Expence {
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
}

const addExpenceService = async (expence: Expence) => {
  return new Promise((resolve, reject) => {
    resolve({ message: "Expence added successfully" });
  });
};

const getExpencesService = async () => {
  return new Promise((resolve, reject) => {
    resolve([
      { category: "test", subcategory: "test", amount: 1, date: "test" },
    ]);
  });
};

const getAllByCategoryService = async (category: string) => {
  return new Promise((resolve, reject) => {
    resolve([
      { category: "test", subcategory: "test", amount: 1, date: "test" },
    ]);
  });
};

const getAllByDateService = async (
  day: string,
  month: string,
  year: string
) => {
  return new Promise((resolve, reject) => {
    resolve([
      { category: "test", subcategory: "test", amount: 1, date: "test" },
    ]);
  });
};

export {
  addExpenceService,
  getExpencesService,
  getAllByCategoryService,
  getAllByDateService,
};
