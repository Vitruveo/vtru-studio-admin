import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function RoleAdd() {
  const [modal, setModal] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const [values, setValues] = React.useState({
    firstname: "",
    lastname: "",
    department: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setModal(!modal);
  };

  return (
    <>
      <Box p={3} pb={1}>
        <Button color="primary" variant="contained" fullWidth onClick={toggle}>
          Add New Role
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Add New Role"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lets add new role for your application. fill the all field and
            <br /> click on submit button.
          </DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Name</FormLabel>
                  <TextField
                    id="firstname"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.firstname}
                    onChange={(e) =>
                      setValues({ ...values, firstname: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="lastname"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.lastname}
                    onChange={(e) =>
                      setValues({ ...values, lastname: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Permissions</FormLabel>
                  <TextField
                    id="department"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.department}
                    onChange={(e) =>
                      setValues({ ...values, department: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      values.firstname.length === 0 || values.notes.length === 0
                    }
                  >
                    Submit
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}