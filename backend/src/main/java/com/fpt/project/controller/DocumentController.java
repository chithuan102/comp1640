/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fpt.project.constant.StatusCode;
import com.fpt.project.model.Comment;
import com.fpt.project.model.Document;
import com.fpt.project.service.CommentService;
import com.fpt.project.service.DocumentService;
import static com.fpt.project.util.ConverterUtils.request2Json;
import static com.fpt.project.util.ConverterUtils.returnComment;
import static com.fpt.project.util.ConverterUtils.returnDocument;
import static com.fpt.project.util.ConverterUtils.returnListDocument;
import com.fpt.project.util.ResponseUtils;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Phong
 */
@RestController
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;
    @Autowired
    private CommentService commentService;

    @PostMapping(value = "/documents", produces = "application/json")
    public String createDocument(@RequestBody Document document) throws IOException {
        Document result = documentService.createDocument(document);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDocument(document))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/documents/{id}", produces = "application/json")
    public String getDocument(@PathVariable(name = "id") int id) {
        Document result = documentService.getDocument(id);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDocument(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @GetMapping(value = "/documents", produces = "application/json")
    public String getDocuments(HttpServletRequest httpServletRequest) {
        int page = Integer.parseInt(httpServletRequest.getParameter("page"));
        int pageSize = Integer.parseInt(httpServletRequest.getParameter("pageSize"));
        String type = httpServletRequest.getParameter("type");
        List<Document> result = documentService.getDocumentByType(type, page, pageSize);
        int totalCount = documentService.countAll();
        return result != null
                ? ResponseUtils.success(StatusCode.SUCCESS, returnListDocument(result, totalCount))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @PutMapping(value = "/documents/{id}", produces = "application/json")
    public String updateDocument(@PathVariable(name = "id") int id, @RequestBody Document document) {
        Document result = documentService.updateDocument(id, document);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnDocument(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/documents/{id}", produces = "application/json")
    public String deleteDocument(@PathVariable(name = "id") int id) {
        documentService.deleteDocument(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }

    @GetMapping(value = "/users/{id}/documents", produces = "application/json")
    public String getDocumentByUser(@PathVariable(name = "id") int id) {
        List<Document> result = documentService.findByUser(id);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListDocument(result));
    }

    @GetMapping(value = "/users/{id}/documents/{type}", produces = "application/json")
    public String getDocumentByUserAndType(@PathVariable(name = "id") int id, @PathVariable("type") String type) {
        List<Document> result = documentService.findByUserAndType(id, type);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListDocument(result));
    }

    @PostMapping(value = "/comments", produces = "application/json")
    public String createComment(@RequestBody Comment comment) throws IOException {
        Comment result = commentService.createComment(comment);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnComment(comment))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @PutMapping(value = "/comments/{id}", produces = "application/json")
    public String updateComment(@PathVariable(name = "id") int id, @RequestBody Comment comment) {
        Comment result = commentService.updateComment(id, comment);
        return result.getId() != 0
                ? ResponseUtils.success(StatusCode.SUCCESS, returnComment(result))
                : ResponseUtils.success(StatusCode.FAILED);
    }

    @DeleteMapping(value = "/comments/{id}", produces = "application/json")
    public String deleteComment(@PathVariable(name = "id") int id) {
        commentService.deleteComment(id);
        return ResponseUtils.success(StatusCode.SUCCESS);
    }
    
    
    @GetMapping(value = "/documents/blog/search", produces = "application/json")
    public String searchBlog(@RequestParam("searchText") String searchText) {
        List<Document> result = documentService.searchBlog(searchText);
        return ResponseUtils.success(StatusCode.SUCCESS, returnListDocument(result));
    }

}
