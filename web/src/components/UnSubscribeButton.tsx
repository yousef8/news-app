import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectIsAuth, selectUser, userData } from "../store/auth/authSlice";
import api from "../api";

interface UnSubscribeButtonProps {
  sourceId: string;
}

const UnSubscribeButton: React.FC<UnSubscribeButtonProps> = ({ sourceId }) => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);
  const unsubscribed = !user?.sourceIds.includes(sourceId);

  const handleUnsubscribe = async () => {
    try {
      await api.post("/unsubscribe", { sourceIds: [sourceId] });
      dispatch(userData());
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <button
        className="btn btn-danger mt-3"
        onClick={handleUnsubscribe}
        disabled={isAuth && unsubscribed}
      >
        {unsubscribed ? "Unsubscribed" : "Unsubscribe"}
        {!isAuth && "Login to unsubscribe"}
      </button>
    </>
  );
};

export default UnSubscribeButton;
