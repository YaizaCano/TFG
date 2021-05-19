//node
//http.STATUS_CODES
//status 200 = ok

const saySomething = (req, res, next) => {
	list = ['yaiza', 'eric'];
  /*res.status(200).json({
    body: list
  });*/
  res.send(list);
};

const helloYou = (req, res, next) => {

	/*res.status(200).json({
		body: 'Hello you!'
	});*/
	res.send("Hello you!");
}

module.exports.saySomething = saySomething;
module.exports.helloYou = helloYou;