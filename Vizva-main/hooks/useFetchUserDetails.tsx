import { useEffect, useState } from "react";
import {
  MoralisCloudFunctionParameters,
  useMoralisCloudFunction,
} from "react-moralis";
import { User } from "vizva";

export default function useFetchUserDetails(
  params: MoralisCloudFunctionParameters & { username?: string }
) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userError, setUserError] = useState<any>(null);
  const { isLoading, error, data } = useMoralisCloudFunction(
    "getUserInfoWithUsername",
    params
  );

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
    if (error) {
      setUserError(error.message);
      setUser(null);
      setLoading(false);
    }
    if (!data) {
      setUserError("this user dosen't exist");
      setUser(null);
      setLoading(true);
    }
    if (data) {
      const { ACL, sessionToken, accounts, authData, ...others } = JSON.parse(
        JSON.stringify(data)
      );
      setUser(others);
      setUserError(null);
      setLoading(false);
    }
  }, [data]);

  return {
    loading,
    data: user,
    error: userError,
  };
}
