let sofor = "Balazs";
let utasok = ["Jani", "Pisti", "Béla", "Gergő", "Apád", "Anyád"];

console.log(`${sofor.padEnd(10)}${utasok[0]}`);

for (let i = 1; i < utasok.length; i += 2) {
    let bal = utasok[i];
    let jobb = utasok[i + 1] ?? "";
    console.log(`${bal.padEnd(10)}${jobb}`);
}