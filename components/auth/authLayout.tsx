import { Image } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex-col flex items-center justify-center p-6">
        <h1 className="font-bold text-[45px] text-black-600">Kamakz ERP</h1>
        {children}
      </div>

      {/* <div className='hidden my-10 md:block'>
        <Divider orientation='vertical' />
      </div> */}

      <div className="bg-[rgba(50,72,194,0.08)] rounded-[15px] hidden md:flex flex-1 relative mr-[20px] my-[15px] items-center justify-center px-6">
        <div className="center bottom-[50px] top-[30px] z-0">
          <Image
            className="w-full h-full"
            src="./illustration.png"
            alt="gradient"
          />
        </div>
      </div>
    </div>
  );
};
