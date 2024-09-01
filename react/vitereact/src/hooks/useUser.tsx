import { UserService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  return useQuery({
    queryKey: ["user/info"],
    queryFn: () => {
      const user = UserService.getUser();
      if (!user) throw new Error("User not found!");
      return user;
    }
  });
}
