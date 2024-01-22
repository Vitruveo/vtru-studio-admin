// const handleAddNewEmails = async (params: { emails: string[] }) => {
//     const validAllowList = params.emails.filter((email) => allowList.includes(email));
//     const validEmails = params.emails.filter((email, index, self) => email.length && !allowList.includes(email));

//     // const uniqueEmails = result.data?.filter(
//     //     (v, index, self) => index === self.findIndex((e) => e.email === v.email)
//     // );

//     if (validEmails.length) {
//         await addMultipleWaitingList(validEmails.map((email) => ({ email })));
//         setEmails((prevState) => [...validEmails.filter((v) => !prevState.includes(v)), ...prevState]);
//         if (validAllowList.length) {
//             setToastr({
//                 type: 'info',
//                 open: true,
//                 message: 'Only the emails not on the allow list have been added.',
//             });
//         }
//     } else {
//         setToastr({
//             type: 'info',
//             open: true,
//             message: 'emails/email already belongs to the allow list',
//         });
//     }
// };
