import { db } from "../database.ts";
interface Expence {
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
}

const addExpenceService = async (expence: Expence) => {
  return new Promise((resolve, reject) => {
    resolve({ message: "Expence added successfully " });
  });
};

const getExpencesService = async () => {
  try {
    return await db`SELECT * FROM books`;
  } catch (e) {
    console.log(e);
  }
};

const getAllByCategoryService = async (category: string) => {
  try {
    return await db`SELECT * FROM books`;
  } catch (e) {
    console.log(e);
  }
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
