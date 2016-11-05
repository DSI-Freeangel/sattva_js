//https://www.npmjs.com/package/node-oauth2-server#getclient-clientid-clientsecret-callback

var connection = require('./mysqlConnection');
module.exports = {
	getClient : function(clientId, clientSecret, callback) {
		return OAuthServiceImpl.getClient(clientId, clientSecret, callback);
	},
	
	grantTypeAllowed : function(clientId, grantType, callback) {
		return OAuthServiceImpl.grantTypeAllowed(clientId, grantType, callback);
	},
	
	getUser : function(username, password, callback) {
		return OAuthServiceImpl.getUser(username, password, callback);
	},
	
	saveAccessToken : function(accessToken, clientId, expires, user, callback) {
		return OAuthServiceImpl.saveAccessToken(accessToken, clientId, expires, user, callback);
	},
	
	saveRefreshToken : function(refreshToken, clientId, expires, user, callback) {
		return OAuthServiceImpl.saveRefreshToken(refreshToken, clientId, expires, user, callback);
	},
	
	getAccessToken : function(bearerToken, callback) {
		return OAuthServiceImpl.getAccessToken(bearerToken, callback);
	}
	
};

var OAuthServiceImpl = new OAuthServiceClass();
function OAuthServiceClass() {
	
	var clients = [{clientId : 123, clientSecret : "5sdgf565gsd8f65gs6dfg675sdf6g85f"}];
	
	var findClientById = function(clientId) {
		console.log("[OAuthService] Get client by ID: " + clientId);
		for(clientIndex in clients) {
			if(clients[clientIndex].clientId == clientId) {
				return clients[clientIndex];
			}
		}
		return;
	};
	
	this.getClient = function(clientId, clientSecret, callback) {
		var client = findClientById(clientId);
		if (client && client.clientSecret == clientSecret) {
			callback(null, client);
			console.log("[OAuthService] getClient by ID: " + clientId + " is successfull");
			return;
		}
		callback(null, false);
	};

	this.grantTypeAllowed = function(clientId, grantType, callback) {
		var client = findClientById(clientId);
		if(client) {
			callback(null, true);
			console.log("[OAuthService] grantTypeAllowed by ID: " + clientId + " is successfull");
			return;
		}
		callback(null, false);
	};
	
	this.getUser = function(username, password, callback) {
		connection.getList("SELECT * FROM USER WHERE NAME=\"" + username + "\" AND PASSWORD=\"" + password + "\"", function(rows, error) {
			if(error) {
				callback(error, false);
			} else if(rows.length = 1) {
				console.log("[OAuthService] getUser with ID: " + rows[0].ID + " is successfull");
				callback(null, rows[0]);
			} else {
				callback(null, false);
			}
		});
	};
	
	this.saveAccessToken = function(accessToken, clientId, expires, user, callback) {
		connection.execute("UPDATE USER SET ACCESS_TOKEN=\"" + accessToken 
				+ "\", ACCESS_TOKEN_EXPIRES=\"" + expires + "\" WHERE ID=" + user.ID, callback);
	};
	
	this.saveRefreshToken = function(refreshToken, clientId, expires, user, callback) {
		connection.execute("UPDATE USER SET REFRESH_TOKEN=\"" + refreshToken 
				+ "\", REFRESH_TOKEN_EXPIRES=\"" + expires + "\" WHERE ID=" + user.ID, callback);
	};
	
	this.getAccessToken = function(bearerToken, callback) {
		connection.getList("SELECT ID, ACCESS_TOKEN_EXPIRES FROM USER WHERE ACCESS_TOKEN=\"" + bearerToken + "\"", function(rows, error) {
			if(error) {
				callback(error, false);
			} else if(rows.length = 1) {
				console.log("[OAuthService] getAccessToken with ID: " + rows[0].ID + " is successfull");
				var result = {
					userId : rows[0].ID,
					expires : new Date(rows[0].ACCESS_TOKEN_EXPIRES)
				};
				callback(null, result);
			} else {
				callback(null, false);
			}
		});
	};
}