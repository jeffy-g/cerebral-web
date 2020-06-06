#!/bin/bash -x
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#
#    Copyright (C) 2019  jeffy-g hirotom1107@gmail.com
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

#
# DEVNOTE: 2019-4-21 - added script to delete references to react definition
# 
#  - 📝 This problem doesn't seem to occur if you do a clean install of the package.
#
for f in ./node_modules/@types/*; do
    echo "scanning @types in $f"
    typedir=$(basename $f)
    reactTypeDir="${f}/node_modules/@types/react"
    if [ -d $reactTypeDir ]; then
        echo "$typedir has referece to react definition."
        npx rimraf $reactTypeDir
    fi
done
#
# DEVNOTE: 2019/7/6 - fix-react-conflict
#
npx rimraf ./node_modules/@material-ui/types/node_modules/@types/react


echo "- - - - remove react-table package inline sourceMap!"
#
# DEVNOTE: 2019-5-22 - added script to delete sourceMappingURL line
#  - 📝 This process is necessary to reduce the size of the webpack development build.
#
for f in ./node_modules/react-table/es/*; do
    if [ -f $f -a ${f##*.} = "js" ]; then
        echo "trying remove inline sourceMap of ${f}."
		# DEVNOTE: 190522 - cannot use '/*sourcemap removed*/',, why?
        npx replace "\\/\\/# sourceMappingURL=data:application.+$" ';' $f
    fi
done
