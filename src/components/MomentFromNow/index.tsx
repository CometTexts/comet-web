import moment from "moment";
import { useEffect, useState } from "react";

interface IProps {
  children: moment.MomentInput;
}

const MomentFromNow: React.FC<IProps> = ({ children }) => {
  const [fromNow, setFromNow] = useState(moment(children).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setFromNow(moment(children).fromNow());
    }, 60000); // every 1 min

    return () => {
      clearInterval(interval);
    };
  }, []);

  return fromNow;
};

export default MomentFromNow;
