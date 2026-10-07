package com.evenza.promotion.controller;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

/**
 * Handles errors originating from PromotionController.
 *
 * Other modules are not affected by this advice.
 */
@ControllerAdvice(assignableTypes = PromotionController.class)
public class PromotionErrorAdvice {

    /**
     * Handles role or ownership failures raised by the service.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ModelAndView handleAccessDenied(
            AccessDeniedException exception
    ) {
        return errorPage(
                HttpStatus.FORBIDDEN,
                "You do not have permission to perform this action. "
                        + "Use the vendor or service provider account "
                        + "that owns this promotion."
        );
    }

    /**
     * Handles invalid business inputs.
     *
     * Form validation errors already caught by the controller
     * continue to appear on the form itself.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ModelAndView handleInvalidInput(
            IllegalArgumentException exception
    ) {
        return errorPage(
                HttpStatus.BAD_REQUEST,
                messageOrDefault(
                        exception.getMessage(),
                        "The supplied promotion details are invalid."
                )
        );
    }

    /**
     * Preserves explicit statuses such as 404 and 409
     * raised by the promotion service.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ModelAndView handleResponseStatus(
            ResponseStatusException exception
    ) {
        return errorPage(
                exception.getStatusCode(),
                messageOrDefault(
                        exception.getReason(),
                        "The requested action could not be completed."
                )
        );
    }

    /**
     * Handles a concurrent edit detected by JPA.
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ModelAndView handleConcurrentEdit(
            OptimisticLockingFailureException exception
    ) {
        return errorPage(
                HttpStatus.CONFLICT,
                "This promotion was changed by another request. "
                        + "Reload its edit page, review the latest "
                        + "details and try again."
        );
    }

    /**
     * Handles an upload rejected by the multipart size limit
     * when the exception reaches this controller's advice.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ModelAndView handleLargeUpload(
            MaxUploadSizeExceededException exception
    ) {
        return errorPage(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "The upload is too large. "
                        + "Choose a PNG or JPEG banner of 2 MB or smaller."
        );
    }

    /**
     * Handles invalid URL or request argument types.
     * Example: a non-numeric promotion ID.
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ModelAndView handleInvalidArgument(
            MethodArgumentTypeMismatchException exception
    ) {
        return errorPage(
                HttpStatus.BAD_REQUEST,
                "The request contains an invalid value. "
                        + "Return to your promotions and select "
                        + "the offer again."
        );
    }

    // ---------- Shared helpers ----------

    private ModelAndView errorPage(
            HttpStatusCode status,
            String message
    ) {
        ModelAndView modelAndView =
                new ModelAndView("promotion/error");

        modelAndView.setStatus(status);
        modelAndView.addObject("message", message);

        return modelAndView;
    }

    private String messageOrDefault(
            String message,
            String fallback
    ) {
        if (message == null || message.isBlank()) {
            return fallback;
        }

        return message;
    }
}