export default function hashLinkGen(n: number): string {
    const randiStri = "p2w5ef9h053a8ui6s9d2k7j0x67m348915435pmszaqkmruevytib";
    const randiStriL = randiStri.length;
    let hash = ''
    for (let i = 0; i < n; ++i) {
        hash+= randiStri[Math.floor(Math.random()*randiStriL)]
    }
    return hash
}
