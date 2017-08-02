const nome = 'Pedro';
const scope = 'o nome nesse escopo é ${nome}';

console.log(eval('`' + scope + '`'));

const diff = (nome) => {
	console.log(eval('`' + scope + '`'));
}

diff('Henrique');