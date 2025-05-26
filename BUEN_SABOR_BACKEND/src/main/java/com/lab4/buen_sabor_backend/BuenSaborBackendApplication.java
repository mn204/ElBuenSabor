package com.lab4.buen_sabor_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;

@SpringBootApplication
public class BuenSaborBackendApplication  implements CommandLineRunner {
    Scanner scanner = new Scanner(System.in);
    public String SEPARADOR = "-------------------------<3----------------------------";

    public static void main(String[] args) {
        SpringApplication.run(BuenSaborBackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println(SEPARADOR);
        System.out.println("Menu de opciones: ");
        System.out.println(SEPARADOR);

        System.out.println("1. Crear Articulo Manufacturado \n" +
                 "2. Ver Articulos Manufacturados \n" +
                "3. Modificar Articulo \n" +
                "4. Eliminar Articulo" );
        System.out.println(SEPARADOR);
        System.out.println("Ingrese una opcion: ");
        int opcion = scanner.nextInt();
        scanner.nextLine();
        switch (opcion) {
            case 1:

                //TODO terminar alta
                break;
            case 2:
                // TODO    funcion de lectura
                break;
            case 3:
                //  TODO    Funcion de Modoficación
                break;
            case 4:
                //TODO Funcion de Eliminacion Logica
                break;
        }

    }

    public void Alta(){}
    public void Lectura(){}
    public void Eliminacion(){}
    public void Modificacion(){}



}
