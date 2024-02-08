import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ArticleActionsProps } from "../../utils/types/props";
import LoadingButton from "@mui/lab/LoadingButton";

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  articleId,
  isDeleting,
  deleteArticleSuccess,
  setOpen,
}) => {
  return (
    <>
      <Link to={`/edit-article/${articleId}`}>
        <Button
          fullWidth
          variant="outlined"
          disabled={deleteArticleSuccess}
          sx={{ mt: 2 }}
        >
          Edit Article
        </Button>
      </Link>
      <LoadingButton
        fullWidth
        variant="contained"
        color="error"
        loading={isDeleting}
        disabled={deleteArticleSuccess}
        onClick={setOpen}
        sx={{ mt: 1 }}
      >
        Delete Article
      </LoadingButton>
    </>
  );
};
