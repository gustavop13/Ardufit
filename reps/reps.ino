void setup() {
  Serial.begin(9600);
}

void loop() {
  for (int inByte = -110; inByte < 10; inByte++) {
    Serial.println(inByte);
    delay(10);
  }
  for (int inByte = 10; inByte > -110; inByte--) {
    Serial.println(inByte);
    delay(10);
  }
}
