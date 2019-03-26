import * as React from "react";
import { Dialog } from './_symlink';

export const Test: React.FunctionComponent<any> = props => {

  // const sampleData = duckHooks.user.sampleUser.useState();
  // const getSampleData = duckHooks.user.sampleUser.useDispatcher.getSampleUser();

  // const [binder, setBinder] = React.useState(Form.jsonDataBinderWithClone({ username: "", password: "" }));
  // const [logginIn, setLoggingIn] = React.useState(false);

  const [dialogVisible, showDialog] = React.useState(false);

  // React.useEffect(() => {
  //   getSampleData({});
  // }, []);

  return (
    <div>
      <Dialog title="I am dialog" isOpen={dialogVisible} onClose={() => showDialog(false)}>
        hello world
      </Dialog>
      Hello. It is me, the homepage<button onClick={() => showDialog(true)}>Show dialog</button>
    </div>
  );
}