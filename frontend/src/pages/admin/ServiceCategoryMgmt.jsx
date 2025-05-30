import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Box,
  useTheme,
  Fade,
  Stack,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Container from "../../components/Container";
export default function ServiceCategoryMgmt() {
  const [categories, setCategories] = useState(["Towing", "Battery Jumpstart"]);
  const [newCategory, setNewCategory] = useState("");
  const theme = useTheme();

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const deleteCategory = (i) => {
    setCategories(categories.filter((_, idx) => idx !== i));
  };

  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            gutterBottom
            sx={{ letterSpacing: 1 }}
          >
            Service Categories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Add or remove service categories for your platform.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              label="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            />
            <Button
              onClick={addCategory}
              variant="contained"
              color="primary"
              sx={{
                minWidth: 140,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Add Category
            </Button>
          </Stack>
          <List
            sx={{
              mt: 2,
              bgcolor: theme.palette.custom.sidebarBg,
              borderRadius: 3,
              boxShadow: theme.shadows[1],
              px: 1,
              py: 1,
              minHeight: 120,
            }}
          >
            {categories.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                No categories yet. Add your first category!
              </Typography>
            ) : (
              categories.map((cat, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <IconButton
                      onClick={() => deleteCategory(i)}
                      color="error"
                      sx={{
                        bgcolor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: theme.palette.error.main,
                          color: "#fff",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  }
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {cat}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Fade>
    </Container>
  );
}
