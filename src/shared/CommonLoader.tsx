import { Spin } from "antd";

const CommonLoader = () => {
   return (
      <div className="flex items-center justify-center h-[60vh]">
         <Spin
            style={{ color: "#1890ff" }}
         />
      </div>
   );
};

export default CommonLoader;