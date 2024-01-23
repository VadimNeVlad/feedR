import React, { useEffect, useRef, useState } from "react";
import { Header } from "../../components/Header/Header";
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { Editor } from "../../components/Editor/Editor";
import { useForm } from "react-hook-form";
import { ArticleData } from "../../utils/types/articles";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCreateArticleMutation } from "../../features/articles/articlesApi";
import { useNavigate } from "react-router-dom";
import { splitTags } from "../../utils/helpers/splitTags";
import { ToastContainer, toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { yupResolver } from "@hookform/resolvers/yup";
import { articleSchema } from "../../utils/validators/articleSchema";
import { ImagePreview } from "../../components/ImagePreview/ImagePreview";

export const AddArticle: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | File>("");
  const [tags, setTags] = useState("");
  const [createArticle, { isSuccess, isLoading, error }] =
    useCreateArticleMutation();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<ArticleData>({
    resolver: yupResolver<any>(articleSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Article created successfully");
      const redirect = setTimeout(() => {
        navigate("/");
      }, 2000);

      return () => clearTimeout(redirect);
    } else if (error) {
      const err = (error as FetchBaseQueryError).data as Error;
      toast.error(err.message);
    }
  }, [isSuccess, navigate, error]);

  const handlePreview = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const urlImage = URL.createObjectURL(file);

    setPreview(urlImage);
    setImage(file);
  };

  const handleClearPreview = () => {
    if (fileRef.current) fileRef.current.value = "";
    setPreview("");
    setImage("");
  };

  const onSubmit = (data: ArticleData) => {
    const formData = new FormData();
    const formattedTags = splitTags(tags);

    formData.append("title", data.title);
    formData.append("body", content);
    formData.append("tagList", JSON.stringify(formattedTags));
    formData.append("image", image);

    createArticle(formData);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 11, pb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Create new article
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ImagePreview
                preview={preview}
                fileRef={fileRef}
                handlePreview={handlePreview}
                handleClearPreview={handleClearPreview}
              />

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="New article title"
                  variant="outlined"
                  type="text"
                  {...register("title", { required: true })}
                />
              </Box>

              <Box>
                <Editor
                  content=""
                  setContent={setContent}
                  isEditable
                  showToolbar
                />
                <TextField
                  type="hidden"
                  sx={{ display: "none" }}
                  value={content}
                  {...register("body", { required: true })}
                />
              </Box>

              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Tags separated by commas, word by either dashes or underscores
                </Typography>
                <TextField
                  fullWidth
                  value={tags}
                  label="Tags"
                  variant="outlined"
                  type="text"
                  {...register("tagList", {
                    required: true,
                    onChange: (e) => setTags(e.target.value.replace(/ /g, "")),
                  })}
                />
              </Box>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                disabled={!content || !isValid || isSuccess}
              >
                Create article
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </Container>

      <ToastContainer />
    </>
  );
};
