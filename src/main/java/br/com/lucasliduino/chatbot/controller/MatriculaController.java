// Pacote da sua aplicação (ex: com.example.chatbot.controller)
package br.com.lucasliduino.chatbot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lucasliduino.chatbot.dto.MatriculaDTO;

@RestController
@RequestMapping("/api")
public class MatriculaController {

    /**
     * Endpoint REST para receber os dados de matrícula do chatbot.
     * Atende requisições POST em /api/matriculas. 
     *
     * @param matriculaDTO Objeto contendo nome, email e curso do aluno. 
     * @return Uma resposta de confirmação para o bot. 
     */
    @PostMapping("/matriculas")
    public ResponseEntity<String> realizarMatricula(@RequestBody MatriculaDTO matriculaDTO) {
        
        // Simulação de gravação dos dados no banco. 
        System.out.println("====== MATRÍCULA RECEBIDA ======");
        System.out.println("Nome: " + matriculaDTO.getNome());
        System.out.println("E-mail: " + matriculaDTO.getEmail());
        System.out.println("Curso: " + matriculaDTO.getCurso());
        System.out.println("=================================");
        System.out.println("Simulando gravação no banco de dados...");

        // Cria a mensagem de resposta para o bot. 
        String respostaParaBot = "Matrícula para " + matriculaDTO.getNome() + 
                                 " no curso de " + matriculaDTO.getCurso() + 
                                 " realizada com sucesso!";

        // Retorna uma resposta de sucesso (HTTP 200 OK) com a mensagem no corpo.
        return ResponseEntity.ok(respostaParaBot);
    }
}
