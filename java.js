var c;
function modInverse(a, m) {
  const extendedEuclidean = (a, b) => {
    if (a === 0n) {
      return [b, 0n, 1n];
    }
    
    const [gcd, x1, y1] = extendedEuclidean(b % a, a);
    const x = y1 - ((b / a) | 0n) * x1;
    const y = x1;
    
    return [gcd, x, y];
  };
  
  const [gcd, x, _] = extendedEuclidean(a, m);
  
  if (gcd !== 1n) {
    throw new Error("The modular inverse does not exist.");
  }
  
  return (x % m + m) % m;
}

// Generate RSA key pair
function generateRSAKeys() {
  //document.getElementById("ctext").value =56;
  const p = 9613034531358350457419158128061542790930984559499621582258315087964794045505647063849125716018034750312098666606492420191808780667421096063354219926661209n;
  //document.getElementById("ctext").value = p;
  const q = 12060191957231446918276794204450896001555925054637033936061798321731482148483764659215389453209175225273226830107120695604602513887145524969000359660045617n;
  const n = p * q;
  //document.getElementById("ctext").value = n;
  const phi = (p - 1n) * (q - 1n);
  //const e = 65537n;
  //document.getElementById("ctext").value = phi;
  const e = BigInt(document.getElementById("earea").value);
  const d = modInverse(e, phi);
  //document.getElementById("ctext").value = d;
  return { publicKey: { n, e }, privateKey: { n, d } };
}

function plaintextToNumber(plaintext) {
  let result = '';
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) { // uppercase letters A-Z
      if(charCode - 65 < 10){
        result += "0"+(charCode - 65).toString();
      }else{
        result += (charCode - 65).toString();
      }
    } else if (charCode >= 97 && charCode <= 122) { // lowercase letters a-z
      if(charCode - 97 < 10){
        result += "0"+(charCode - 97).toString();
      }else{
        result += (charCode - 97).toString();
      }
    }
    if(charCode == 32){
      result += "26";
    }
  }
  //document.getElementById("ctext").value = typeof(BigInt(result));
  return BigInt(result);
}

  


//modpow function implementation
function modPow(a, b, n) {
  let result = 1n;
  a = a % n;
  while (b > 0) {
    if (b % 2n == 1n) {
      result = (result * a) % n;
    }
    b = b / 2n;
    a = (a * a) % n;
  }
  return result;
}
// Encrypt plaintext message using RSA
function rsaEncrypt(plaintext, publicKey) {
  //document.getElementById("ctext").value = plaintext;
  const m = plaintextToNumber(plaintext);
  document.getElementById("enc").innerHTML = "Encrypted and the value = "+m;
  //document.getElementById("ctext").value = m;
  const { n, e } = publicKey;
  //document.getElementById("ctext").value = n;
   c = modPow(m, BigInt(e), BigInt(n));
  //document.getElementById("ctext").value = c;
  return c;
}

function bigNumberToAscii(number) {
  let ascii = "";
  while (number > 0n) {
    const digit = (number % BigInt(100));
    if(parseInt(digit) != 26){
      ascii = String.fromCharCode(parseInt(digit)+65) + ascii;
    }else{
      ascii = String.fromCharCode(32) + ascii;
    }
    number = (number / BigInt(100));
  }
  //document.getElementById("parea").value = 34;
  return ascii;
}
// Decrypt ciphertext message using RSA
function rsaDecrypt(ciphertext, privateKey) {
  const c = BigInt(document.getElementById("carea").value);
  //document.getElementById("parea").value = c;
  const { n, d } = privateKey;
  const m = modPow(BigInt(c), BigInt(d), BigInt(n));
  document.getElementById("dec").innerHTML = "Decrypted and the value = "+m;
  //document.getElementById("parea").value = m;
  //const result =  numberToPlaintext(m,d,n);
  const result =  bigNumberToAscii(m);
  document.getElementById("parea").value = result;
}

function encrypt() {
  const keys = generateRSAKeys();
  const plaintext = document.getElementById("ptext").value;
  const ciphertext = rsaEncrypt(plaintext, keys.publicKey);

  document.getElementById("ctext").value = ciphertext;
  document.getElementById("carea").value = ciphertext;
  document.getElementById("encryptBtn").style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
  document.getElementById("encryptBtn").value = 'Encrypted';
  document.getElementById("enc").textContent = "Text has been encrypted!";
}

function decrypt() {
  const keys = generateRSAKeys();
  const ciphertext = document.getElementById("carea").value;
  const decrypted = rsaDecrypt(ciphertext, keys.privateKey);

  document.getElementById("parea").value = decrypted;
  document.getElementById("decryptBtn").style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
  document.getElementById("decryptBtn").value = 'Decrypted';
  document.getElementById("dec").textContent = "Text has been decrypted!";
}
