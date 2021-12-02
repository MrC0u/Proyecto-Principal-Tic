//#ifndef HAVE_HWSERIAL1

// Librerias
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>
#include "WiFiEsp.h"

//Inicialización de pin:
  // Inicializacion Boton
  const int inputPin = 2;
  int value = 0;
  
  //Pin donde se conecta el bus 1-Wire 
  //Sensor de Temperatura 
  const int pinDatosDQ = 9;

  //Sensor de Flujo
  const int sensorPin = 2;

  //Módulo WIFI
  SoftwareSerial Serial1(10, 11); // RX, TX
  
//Inicializacion Datos Extras
  // Instancia a las clases OneWire y DallasTemperature
  OneWire oneWireObjeto(pinDatosDQ);
  DallasTemperature sensorDS18B20(&oneWireObjeto);  
  float temp_final = 0;

  //Sensor de Flujo
  float flujo_Tot = 0;
  const int measureInterval = 2500;
  volatile int pulseConter;
  const float factorK = 7.5;

  //Inicializar datos WIFI
    char ssid[] = "SSID";            // Nombre de la red WIFI
    char pass[] = "Password";        // Contraseña de la red
    int status = WL_IDLE_STATUS;     // the Wifi radio's status
    
    char server[] = ""; // nombre de la pagina
    
    // Initialize the Ethernet client object
    WiFiEspClient client;

//Funciones Extras
void ISRCountPulse()
{
  pulseConter++;
 }
 float GetFrequency()
 {
    pulseConter = 0;
    interrupts();
    delay(measureInterval);
    noInterrupts();
   
    return (float)pulseConter * 1000 / measureInterval;
 }
void setup() {
    // Iniciamos la comunicacion serie
    Serial.begin(9600);

    //Iniciar boton
    pinMode(inputPin, INPUT);
    
    // Iniciamos el bus 1-Wire
    sensorDS18B20.begin(); 

    attachInterrupt(digitalPinToInterrupt(sensorPin), ISRCountPulse, RISING);
  
    // initialize serial for ESP module
    Serial1.begin(9600);
    // initialize ESP module
    WiFi.init(&Serial1);
  
    // check for the presence of the shield
    if (WiFi.status() == WL_NO_SHIELD) {
      Serial.println("WiFi shield not present");
      // don't continue
      //while (true);
    }
  /*
    // attempt to connect to WiFi network
    while ( status != WL_CONNECTED) {
      Serial.print("Attempting to connect to WPA SSID: ");
      Serial.println(ssid);
      // Connect to WPA/WPA2 network
      status = WiFi.begin(ssid, pass);
    }
  
    // you're connected now, so print out the data
    Serial.println("You're connected to the network");
    
    printWifiStatus();
    */
  /*
    Serial.println();
    Serial.println("Starting connection to server...");
    // if you get a connection, report back via serial
    if (client.connect(server, 80)) {
      Serial.println("Connected to server");
      // Make a HTTP request
      client.print("GET /arduino.php?");
      client.print("id=");
      client.print(userid);
      client.print("&mode=setup");
      client.println(" HTTP/1.1");
      client.println("Host: moneditics.tk");
      client.println("Connection: close");
      client.println();
      
      
    }
    */

}

void loop() {
    value = digitalRead(inputPin);  //lectura digital de pin
  
    // Mandamos comandos para toma de temperatura a los sensores
    //Serial.println("Mandando comandos a los sensores");
    sensorDS18B20.requestTemperatures();

    // Leemos y mostramos los datos de los sensores DS18B20
    //Serial.print("Temperatura sensor 0: ");
    //Serial.print(sensorDS18B20.getTempCByIndex(0));
    //Serial.println(" C");

    //Temperatura final
    temp_final = sensorDS18B20.getTempCByIndex(0);
    
     // obtener frecuencia en Hz
     float frequency = GetFrequency();
   
     // calcular caudal L/min
     float flow_Lmin = frequency / factorK;

     //calcular flujo total
     flujo_Tot += flow_Lmin; 
  
     //Serial.print("Frecuencia: ");
     //Serial.print(frequency, 0);
     //Serial.print(" (Hz)\tCaudal: ");
     //Serial.print(flow_Lmin, 3);
     //Serial.println(" (L/min)");

      //Al Presionar el boton se mandan los datos
      if (value == HIGH) {
        
            Serial.print(" (Hz)\tCaudal: ");
            Serial.print(flujo_Tot);
            Serial.println(" (L/min)");
            Serial.print("\t");
            Serial.print("Temperatura sensor 0: ");
            Serial.print(temp_final);
            Serial.println(" C");
          
           /*
            * Agregar los datos que se desean mandar
          Serial.println("Starting connection to server...");
          // if you get a connection, report back via serial
          if (client.connect(server, 80)) {
            Serial.println("Connected to server");
            // Make a HTTP request
            client.print("GET /arduino.php?");
            client.print("Temp=");
            client.print(Temperatura);
            client.println("Host:");
            client.println("Connection: close");
            client.println();
          }
      
          delay(6000);
          
         }*/
      }
      else {
          
      }
     
    delay(1000); 

    

    /*
  Serial.println("Starting connection to server...");
    // if you get a connection, report back via serial
    if (client.connect(server, 80)) {
      Serial.println("Connected to server");
      // Make a HTTP request
      client.print("GET /arduino.php?");
      client.print("moneyworth=");
      client.print(MoneyWorth);
      client.print("&mode=contador");
      client.println(" HTTP/1.1");
      client.println("Host: moneditics.tk");
      client.println("Connection: close");
      client.println();
    }

    delay(6000);
    
   }*/

}

void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
  
