export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'checkGuess' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'getWord' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
