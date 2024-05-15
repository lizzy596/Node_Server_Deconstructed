import { Document, Model, Schema } from 'mongoose';

interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}




function removeEmptyProps<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.keys(obj).reduce((acc, prop) => {
    if (obj[prop] === "") return acc;

    return {
      ...acc,
      [prop]: obj[prop],
    };
  }, {});
}

const paginate = (schema: Schema<Document>): void => {
  schema.statics.paginate = async function (
    this: Model<Document>,
    unCheckedFilter: Record<string, any>,
    options: {
      sortBy?: string;
      populate?: string;
      limit?: number;
      page?: number;
    },
    search?: string
  ): Promise<QueryResult> {
    const filter = removeEmptyProps(unCheckedFilter);

    if (filter?.startDate) {
      Object.assign(filter, {
        createdAt: {
          ...filter.createdAt,
          $gte: new Date(parseInt(filter.startDate, 10)),
        },
      });
      delete filter.startDate;
    }
    if (filter?.endDate) {
      Object.assign(filter, {
        createdAt: {
          ...filter.createdAt,
          $lt: new Date(
            new Date(parseInt(filter.endDate, 10)).setDate(
              new Date(parseInt(filter.endDate, 10)).getDate() + 1,
            ),
          ),
        },
      });
      delete filter.endDate;
    }

    let sort = "";
    if (options.sortBy) {
      const sortingCriteria:string[]= [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit =
      options.limit && parseInt(options.limit.toString(), 10) > 0
        ? parseInt(options.limit.toString(), 10)
        : 10;
    const page =
      options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1;
    const skip = (page - 1) * limit;

    const searchFilter = [...this.searchableFields()].map((field) => {
      return {
        [field]: { $regex: search, $options: "i" },
      };
    });
    const searchQuery = search ? { $or: searchFilter } : {};

    const countPromise = this.countDocuments({
      ...filter,
      ...searchQuery,
    }).exec();
    let docsPromise = this.find({ ...filter, ...searchQuery })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split(".")
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result: QueryResult = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

export default paginate;
