package com.madhukar.upisplitter.dto;
public final class ApiResponseFactory { private ApiResponseFactory(){} public static <T> ApiDtos.ApiResponse<T> ok(String message,T data){return new ApiDtos.ApiResponse<>(true,message,data);} }
