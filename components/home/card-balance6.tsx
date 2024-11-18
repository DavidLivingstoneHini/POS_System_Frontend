import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";
import { MoneyIcon } from "../icons/accounts/money-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";

export const CardBalance6 = () => {
  return (
    <Card className="xl:max-w-sm bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-md w-full mx-auto">
      <CardBody className="py-5 flex flex-col justify-center items-center">
        <div className="flex justify-center text-blue-800 items-center mb-2 border-3 w-[40px] h-[40px] border-white rounded-[100%]">
          <CustomersIcon />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-white text-lg font-semibold">Customer Support</span>
        </div>
      </CardBody>
    </Card>
  );
};
