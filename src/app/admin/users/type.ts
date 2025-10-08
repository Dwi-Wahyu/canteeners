import getUsersDataByRole from "./queries";

export type GetUsersTableDataResponseType = Awaited<
  ReturnType<typeof getUsersDataByRole>
>;

export type UsersTableDataType = GetUsersTableDataResponseType["data"][number];
