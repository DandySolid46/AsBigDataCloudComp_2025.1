// Pacote da sua aplicação (ex: com.example.chatbot.dto)
package br.com.lucasliduino.chatbot.dto;

public class MatriculaDTO {
    private String nome;
    private String email;
    private String curso;

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }
}