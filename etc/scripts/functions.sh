#
# param 1 - destination directory
# param 2 - exclude extention
# param 3 - "--firebase" or additional gulp parameter
#
copy-assets() {

	# DEVNOTE: If parameter is expanded with double quote,
	#  if parameter is not set, it will be "" and it will be interpreted as a null character task name by gulp api
	#   -> Therefore, if expansion is required with double quote, like the following code is required
	# local param3
	# [ -z $3 ] && param3=--dummy || param3=$3
	# npx gulp pug --publish --pugOutDir "$1" "$param3" # OK

	npx cpx "./docs/**/!(typeid-map.${2}|webpack.${2}|jquery.js|compressed-script-loader.d*|tsconfig.tsbuildinfo)" "$1" -u
	npx gulp pug --publish --pugOutDir "$1" $3
}
