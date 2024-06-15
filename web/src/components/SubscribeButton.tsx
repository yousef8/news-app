import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectIsAuth, selectUser, userData } from "../store/auth/authSlice";
import api from "../api";

interface SubscribeButtonProps {
  sourceId: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ sourceId }) => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);
  const subscribed = user?.sourceIds.includes(sourceId);

  const handleSubscribe = async () => {
    try {
      await api.post("/subscribe", { sourceIds: [sourceId] });
      dispatch(userData());
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary mt-3"
        onClick={handleSubscribe}
        disabled={!isAuth || subscribed}
      >
        {isAuth && (subscribed ? "Subscribed" : "Subscribe")}
        {!isAuth && "Login to subscribe"}
      </button>
    </>
  );
};

export default SubscribeButton;
