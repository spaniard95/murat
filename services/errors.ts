export class CategoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}

export class SubcategoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubcategoryNotFoundError";
  }
}

export class CategoryGoalAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryGoalAlreadyExistsError";
  }
}
