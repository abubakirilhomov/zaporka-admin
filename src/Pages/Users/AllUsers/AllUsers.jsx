import React, { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import CustomPagination from "../../../Components/";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const skip = (currentPage - 1) * usersPerPage;

  const { data, loading, error, revalidate } = useFetch(
    `https://dummyjson.com/users?skip=${skip}&limit=${usersPerPage}`,
    {},
    false
  );


  useEffect(() => {
    revalidate();
  }, [currentPage]);

  if (loading || !data || !data.users) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-error text-lg">Error: {error}</p>;
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "Имя" },
    { key: "lastName", label: "Фамилия" },
    { key: "email", label: "Email" },
    { key: "age", label: "Возраст" },
    { key: "gender", label: "Пол" },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center p-5 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-base-content">Все пользователи</h2>
      
      <div className="w-full flex-grow overflow-auto">
        <CustomTable data={data.users} columns={columns} emptyMessage="Пользователи не найдены" />
      </div>

      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(208 / usersPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AllUsers;