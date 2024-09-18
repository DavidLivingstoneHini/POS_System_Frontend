import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { MoneyIcon } from "../icons/accounts/money-icon";

export const CardBalance1 = () => {
  return (
    <Card className="xl:max-w-sm bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-md w-full mx-auto">
      <CardBody className="py-5 flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-2 border-3 w-[40px] h-[40px] border-white rounded-[100%]">
          <MoneyIcon className="w-[150px] h-[150px] object-cover" />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-white text-lg font-semibold">POS</span>
        </div>
      </CardBody>
    </Card>
  );
};
