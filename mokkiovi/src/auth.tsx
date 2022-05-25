/**
 * This represents some generic auth provider API, like Firebase.
 */
const mokkioviAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    mokkioviAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    mokkioviAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export default mokkioviAuthProvider;
