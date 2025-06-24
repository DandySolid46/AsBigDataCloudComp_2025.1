// Pacote raiz da sua aplicação
package br.com.lucasliduino.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal que inicia a aplicação Spring Boot.
 * É o ponto de entrada do backend.
 */
@SpringBootApplication
public class MatriculaApplication {

    /**
     * O método main é o ponto de partida para a execução do programa Java.
     * @param args Argumentos de linha de comando (não usaremos neste projeto).
     */
    public static void main(String[] args) {
        // A linha abaixo inicializa o Spring e inicia o servidor web embutido (Tomcat).
        SpringApplication.run(MatriculaApplication.class, args);
    }
}