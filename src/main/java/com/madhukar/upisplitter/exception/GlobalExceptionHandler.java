package com.madhukar.upisplitter.exception;
import com.madhukar.upisplitter.dto.ApiDtos; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.util.stream.Collectors;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ApiException.class) ResponseEntity<ApiDtos.ApiResponse<Void>> api(ApiException e){return ResponseEntity.status(e.status).body(new ApiDtos.ApiResponse<>(false,e.getMessage(),null));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiDtos.ApiResponse<Void>> validation(MethodArgumentNotValidException e){String m=e.getBindingResult().getFieldErrors().stream().map(x->x.getField()+": "+x.getDefaultMessage()).collect(Collectors.joining(", "));return ResponseEntity.badRequest().body(new ApiDtos.ApiResponse<>(false,m,null));}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiDtos.ApiResponse<Void>> generic(Exception e){return ResponseEntity.status(500).body(new ApiDtos.ApiResponse<>(false,"An unexpected server error occurred",null));}
}
