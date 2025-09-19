import Moralis from "moralis-v1/types";

interface Activity {
  description: string;
  notifyUser: boolean;
  category: string;
  type: string;
}

interface ActivityProps {
  isAuthenticated: boolean;
  Moralis: typeof Moralis;
  activity: Activity;
}

// function to save the activity
export function addActivity(props: ActivityProps) {
  const { Moralis, isAuthenticated, activity } = props;
  const saveActivity = async () => {
    if (!isAuthenticated) {
      return;
    }
    const saveActivity = await Moralis.Cloud.run("addUserActivity", activity);
    return saveActivity;
  };

  // call the function with params
  saveActivity();
}
