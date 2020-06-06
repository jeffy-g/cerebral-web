( function( global, factory ) {
	"use strict";
	factory( global );
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
"use strict";
var arr = [];
var getProto = Object.getPrototypeOf;
var slice = arr.slice;
var concat = arr.concat;
var push = arr.push;
var indexOf = arr.indexOf;
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call( Object );
var trim = "".trim;
var support = {};
var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};
var document = window.document;
	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};
	function DOMEval( code, node, doc ) {
		doc = doc || document;
		var i, val,
			script = doc.createElement( "script" );
		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
var
	version = "4.0.0-pre -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-deprecated,-wrap,-css/hiddenVisibleSelectors,-effects/animatedSelector,-exports/amd,-core/ready,-event/alias,-event/trigger",
	jQuery = function( selector, context ) {
		return new jQuery.fn.init( selector, context );
	};
jQuery.fn = jQuery.prototype = {
	jquery: version,
	constructor: jQuery,
	length: 0,
	toArray: function() {
		return slice.call( this );
	},
	get: function( num ) {
		if ( num == null ) {
			return slice.call( this );
		}
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},
	pushStack: function( elems ) {
		var ret = jQuery.merge( this.constructor(), elems );
		ret.prevObject = this;
		return ret;
	},
	each: function( callback ) {
		return jQuery.each( this, callback );
	},
	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},
	first: function() {
		return this.eq( 0 );
	},
	last: function() {
		return this.eq( -1 );
	},
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},
	end: function() {
		return this.prevObject || this.constructor();
	},
	push: push,
	sort: arr.sort,
	splice: arr.splice
};
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[ i ] || {};
		i++;
	}
	if ( typeof target !== "object" && typeof target !== "function" ) {
		target = {};
	}
	if ( i === length ) {
		target = this;
		i--;
	}
	for ( ; i < length; i++ ) {
		if ( ( options = arguments[ i ] ) != null ) {
			for ( name in options ) {
				copy = options[ name ];
				if ( name === "__proto__" || target === copy ) {
					continue;
				}
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;
					target[ name ] = jQuery.extend( deep, clone, copy );
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	return target;
};
jQuery.extend( {
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	isReady: true,
	error: function( msg ) {
		throw new Error( msg );
	},
	noop: function() {},
	isPlainObject: function( obj ) {
		var proto, Ctor;
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}
		proto = getProto( obj );
		if ( !proto ) {
			return true;
		}
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
	globalEval: function( code, options ) {
		DOMEval( code, { nonce: options && options.nonce } );
	},
	each: function( obj, callback ) {
		var length, i = 0;
		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}
		return obj;
	},
	trim: function( text ) {
		return text == null ? "" : trim.call( text );
	},
	makeArray: function( arr, results ) {
		var ret = results || [];
		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}
		return ret;
	},
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;
		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}
		first.length = i;
		return first;
	},
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}
		return matches;
	},
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );
				if ( value != null ) {
					ret.push( value );
				}
			}
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );
				if ( value != null ) {
					ret.push( value );
				}
			}
		}
		return concat.apply( [], ret );
	},
	guid: 1,
	support: support
} );
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );
function isArrayLike( obj ) {
	var length = !!obj && obj.length,
		type = toType( obj );
	if ( typeof obj === "function" || isWindow( obj ) ) {
		return false;
	}
	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var documentElement = document.documentElement;
var hasDuplicate, sortInput,
	rhtmlSuffix = /HTML$/i,
	sortStable = jQuery.expando.split( "" ).sort( sortOrder ).join( "" ) === jQuery.expando,
	matches = documentElement.matches || documentElement.msMatchesSelector,
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {
			if ( ch === "\0" ) {
				return "\uFFFD";
			}
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}
		return "\\" + ch;
	};
function sortOrder( a, b ) {
	if ( a === b ) {
		hasDuplicate = true;
		return 0;
	}
	var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
	if ( compare ) {
		return compare;
	}
	compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
		a.compareDocumentPosition( b ) :
		1;
	if ( compare & 1 ) {
		if ( a === document || a.ownerDocument === document &&
			jQuery.contains( document, a ) ) {
			return -1;
		}
		if ( b === document || b.ownerDocument === document &&
			jQuery.contains( document, b ) ) {
			return 1;
		}
		return sortInput ?
			( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
			0;
	}
	return compare & 4 ? -1 : 1;
}
function uniqueSort( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;
	hasDuplicate = false;
	sortInput = !sortStable && results.slice( 0 );
	results.sort( sortOrder );
	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}
	sortInput = null;
	return results;
}
function escape( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
}
jQuery.extend( {
	uniqueSort: uniqueSort,
	unique: uniqueSort,
	escapeSelector: escape,
	find: function( selector, context, results, seed ) {
		var elem, nodeType,
			i = 0;
		results = results || [];
		context = context || document;
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}
		if ( ( nodeType = context.nodeType ) !== 1 && nodeType !== 9 ) {
			return [];
		}
		if ( seed ) {
			while ( ( elem = seed[ i++ ] ) ) {
				if ( jQuery.find.matchesSelector( elem, selector ) ) {
					results.push( elem );
				}
			}
		} else {
			jQuery.merge( results, context.querySelectorAll( selector ) );
		}
		return results;
	},
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
		if ( !nodeType ) {
			while ( ( node = elem[ i++ ] ) ) {
				ret += jQuery.text( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			return elem.textContent;
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		return ret;
	},
	contains: function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains( bup ) );
	},
	isXMLDoc: function( elem ) {
		var namespace = elem.namespaceURI,
			documentElement = ( elem.ownerDocument || elem ).documentElement;
		return !rhtmlSuffix.test( namespace ||
			documentElement && documentElement.nodeName ||
			"HTML" );
	},
	expr: {
		attrHandle: {},
		match: {
			bool: new RegExp( "^(?:checked|selected|async|autofocus|autoplay|controls|defer" +
				"|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i" ),
			needsContext: /^[\x20\t\r\n\f]*[>+~]/
		}
	}
} );
jQuery.extend( jQuery.find, {
	matches: function( expr, elements ) {
		return jQuery.find( expr, null, null, elements );
	},
	matchesSelector: function( elem, expr ) {
		return matches.call( elem, expr );
	},
	attr: function( elem, name ) {
		var fn = jQuery.expr.attrHandle[ name.toLowerCase() ],
			value = fn && hasOwn.call( jQuery.expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, jQuery.isXMLDoc( elem ) ) :
				undefined;
		return value !== undefined ? value : elem.getAttribute( name );
	}
} );
var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;
	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};
var siblings = function( n, elem ) {
	var matched = [];
	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}
	return matched;
};
var rneedsContext = jQuery.expr.match.needsContext;
function nodeName( elem, name ) {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
function winnow( elements, qualifier, not ) {
	if ( typeof qualifier === "function" ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}
	return jQuery.filter( qualifier, elements, not );
}
jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];
	if ( not ) {
		expr = ":not(" + expr + ")";
	}
	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}
	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};
jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;
		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}
		ret = this.pushStack( [] );
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}
		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );
var rootjQuery,
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;
		if ( !selector ) {
			return this;
		}
		root = root || rootjQuery;
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {
				match = [ null, selector, null ];
			} else {
				match = rquickExpr.exec( selector );
			}
			if ( match && ( match[ 1 ] || !context ) ) {
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							if ( typeof this[ match ] === "function" ) {
								this[ match ]( context[ match ] );
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}
					return this;
				} else {
					elem = document.getElementById( match[ 2 ] );
					if ( elem ) {
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );
			} else {
				return this.constructor( context ).find( selector );
			}
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;
		} else if ( typeof selector === "function" ) {
			return root.ready !== undefined ?
				root.ready( selector ) :
				selector( jQuery );
		}
		return jQuery.makeArray( selector, this );
	};
init.prototype = jQuery.fn;
rootjQuery = jQuery( document );
var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};
jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;
		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},
	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {
						matched.push( cur );
						break;
					}
				}
			}
		}
		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},
	index: function( elem ) {
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}
		return indexOf.call( this,
			elem.jquery ? elem[ 0 ] : elem
		);
	},
	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},
	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );
function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}
jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&
			getProto( elem.contentDocument ) ) {
			return elem.contentDocument;
		}
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}
		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );
		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}
		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}
		if ( this.length > 1 ) {
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}
		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}
jQuery.Callbacks = function( options ) {
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );
	var
		firing,
		memory,
		fired,
		locked,
		list = [],
		queue = [],
		firingIndex = -1,
		fire = function() {
			locked = locked || options.once;
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {
						firingIndex = list.length;
						memory = false;
					}
				}
			}
			if ( !options.memory ) {
				memory = false;
			}
			firing = false;
			if ( locked ) {
				if ( memory ) {
					list = [];
				} else {
					list = "";
				}
			}
		},
		self = {
			add: function() {
				if ( list ) {
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}
					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( typeof arg === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {
								add( arg );
							}
						} );
					} )( arguments );
					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			fired: function() {
				return !!fired;
			}
		};
	return self;
};
function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}
function adoptValue( value, resolve, reject, noValue ) {
	var method;
	try {
		if ( value && typeof( method = value.promise ) === "function" ) {
			method.call( value ).done( resolve ).fail( reject );
		} else if ( value && typeof( method = value.then ) === "function" ) {
			method.call( value, resolve, reject );
		} else {
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}
	} catch ( value ) {
		reject( value );
	}
}
jQuery.extend( {
	Deferred: function( func ) {
		var tuples = [
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				catch: function( fn ) {
					return promise.then( null, fn );
				},
				pipe: function(  ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {
							var fn = typeof fns[ tuple[ 4 ] ] === "function" &&
								fns[ tuple[ 4 ] ];
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && typeof returned.promise === "function" ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;
									if ( depth < maxDepth ) {
										return;
									}
									returned = handler.apply( that, args );
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}
									then = returned &&
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;
									if ( typeof then === "function" ) {
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);
										} else {
											maxDepth++;
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}
									} else {
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}
										( special || deferred.resolveWith )( that, args );
									}
								},
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {
											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}
											if ( depth + 1 >= maxDepth ) {
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}
												deferred.rejectWith( that, args );
											}
										}
									};
							if ( depth ) {
								process();
							} else {
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}
					return jQuery.Deferred( function( newDefer ) {
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								typeof onProgress === "function" ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								typeof onFulfilled === "function" ?
									onFulfilled :
									Identity
							)
						);
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								typeof onRejected === "function" ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];
			promise[ tuple[ 1 ] ] = list.add;
			if ( stateString ) {
				list.add(
					function() {
						state = stateString;
					},
					tuples[ 3 - i ][ 2 ].disable,
					tuples[ 3 - i ][ 3 ].disable,
					tuples[ 0 ][ 2 ].lock,
					tuples[ 0 ][ 3 ].lock
				);
			}
			list.add( tuple[ 3 ].fire );
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );
		promise.promise( deferred );
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},
	when: function( singleValue ) {
		var
			remaining = arguments.length,
			i = remaining,
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),
			master = jQuery.Deferred(),
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );
			if ( master.state() === "pending" ||
				typeof( resolveValues[ i ] && resolveValues[ i ].then ) === "function" ) {
				return master.then();
			}
		}
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}
		return master.promise();
	}
} );
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
jQuery.Deferred.exceptionHook = function( error, stack ) {
	if ( error && rerrorNames.test( error.name ) ) {
		window.console.warn(
			"jQuery.Deferred exception: " + error.message,
			error.stack,
			stack
		);
	}
};
jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}
	} else if ( value !== undefined ) {
		chainable = true;
		if ( typeof value !== "function" ) {
			raw = true;
		}
		if ( bulk ) {
			if ( raw ) {
				fn.call( elems, value );
				fn = null;
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}
		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}
	if ( chainable ) {
		return elems;
	}
	if ( bulk ) {
		return fn.call( elems );
	}
	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var rdashAlpha = /-([a-z])/g;
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}
function camelCase( string ) {
	return string.replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};
function Data() {
	this.expando = jQuery.expando + Data.uid++;
}
Data.uid = 1;
Data.prototype = {
	cache: function( owner ) {
		var value = owner[ this.expando ];
		if ( !value ) {
			value = {};
			if ( acceptData( owner ) ) {
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}
		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;
		} else {
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {
			return this.get( owner, key );
		}
		this.set( owner, key, value );
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];
		if ( cache === undefined ) {
			return;
		}
		if ( key !== undefined ) {
			if ( Array.isArray( key ) ) {
				key = key.map( camelCase );
			} else {
				key = camelCase( key );
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}
			i = key.length;
			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();
var dataUser = new Data();
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;
function getData( data ) {
	if ( data === "true" ) {
		return true;
	}
	if ( data === "false" ) {
		return false;
	}
	if ( data === "null" ) {
		return null;
	}
	if ( data === +data + "" ) {
		return +data;
	}
	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}
	return data;
}
function dataAttr( elem, key, data ) {
	var name;
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );
		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},
	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},
	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},
	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );
jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );
				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}
			return data;
		}
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}
		return access( this, function( value ) {
			var data;
			if ( elem && value === undefined ) {
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}
				return;
			}
			this.each( function() {
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},
	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );
jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},
	dequeue: function( elem, type ) {
		type = type || "fx";
		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}
		if ( fn ) {
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}
		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );
jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}
		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}
		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );
				jQuery._queueHooks( this, type );
				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};
		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";
		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
var isHiddenWithinTree = function( elem, el ) {
		elem = el || elem;
		return elem.style.display === "none" ||
			elem.style.display === "" &&
			jQuery.css( elem, "display" ) === "none";
	};
var ralphaStart = /^[a-z]/,
	rautoPx = /^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/;
function isAutoPx( prop ) {
	return ralphaStart.test( prop ) &&
		rautoPx.test( prop[ 0 ].toUpperCase() + prop.slice( 1 ) );
};
function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( isAutoPx( prop ) ? "px" : "" ),
		initialInUnit = elem.nodeType &&
			( !isAutoPx( prop ) || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );
	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
		initial = initial / 2;
		unit = unit || initialInUnit[ 3 ];
		initialInUnit = +initial || 1;
		while ( maxIterations-- ) {
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;
		}
		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );
		valueParts = valueParts || [];
	}
	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rmsPrefix = /^-ms-/;
function cssCamelCase( string ) {
	return camelCase( string.replace( rmsPrefix, "ms-" ) );
}
var defaultDisplayMap = {};
function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];
	if ( display ) {
		return display;
	}
	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );
	temp.parentNode.removeChild( temp );
	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;
	return display;
}
function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		display = elem.style.display;
		if ( show ) {
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";
				dataPriv.set( elem, "display", display );
			}
		}
	}
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}
	return elements;
}
jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}
		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isIE = document.documentMode;
var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );
var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );
var wrapMap = {
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	_default: [ 0, "", "" ]
};
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;
function getAll( context, tag ) {
	var ret;
	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );
	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );
	} else {
		ret = [];
	}
	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}
	return ret;
}
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;
	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}
var rhtml = /<|&#?\w+;/;
function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;
	for ( ; i < l; i++ ) {
		elem = elems[ i ];
		if ( elem || elem === 0 ) {
			if ( toType( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}
				jQuery.merge( nodes, tmp.childNodes );
				tmp = fragment.firstChild;
				tmp.textContent = "";
			}
		}
	}
	fragment.textContent = "";
	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}
		attached = isAttached( elem );
		tmp = getAll( fragment.appendChild( elem ), "script" );
		if ( attached ) {
			setGlobalEval( tmp );
		}
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}
	return fragment;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );
var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
function returnTrue() {
	return true;
}
function returnFalse() {
	return false;
}
function expectSync( elem, type ) {
	return ( elem === document.activeElement ) === ( type === "focus" );
}
function on( elem, types, selector, data, fn, one ) {
	var origFn, type;
	if ( typeof types === "object" ) {
		if ( typeof selector !== "string" ) {
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}
	if ( data == null && fn == null ) {
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {
			fn = data;
			data = undefined;
		} else {
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}
	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}
jQuery.event = {
	global: {},
	add: function( elem, types, handler, data, selector ) {
		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );
		if ( !elemData ) {
			return;
		}
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
			if ( !type ) {
				continue;
			}
			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			special = jQuery.event.special[ type ] || {};
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}
			if ( special.add ) {
				special.add.call( elem, handleObj );
				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}
			jQuery.event.global[ type ] = true;
		}
	},
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}
			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];
				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );
					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}
				delete events[ type ];
			}
		}
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},
	dispatch: function( nativeEvent ) {
		var event = jQuery.event.fix( nativeEvent );
		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};
		args[ 0 ] = event;
		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}
		event.delegateTarget = this;
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;
			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {
					event.handleObj = handleObj;
					event.data = handleObj.data;
					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );
					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}
		return event.result;
	},
	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;
		if ( delegateCount &&
			!( event.type === "click" && event.button >= 1 ) ) {
			for ( ; cur !== this; cur = cur.parentNode || this ) {
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector + " ";
						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}
		return handlerQueue;
	},
	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,
			get: typeof hook === "function" ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},
			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},
	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},
	special: {
		load: {
			noBubble: true
		},
		click: {
			setup: function( data ) {
				var el = this || data;
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {
					leverageNative( el, "click", returnTrue );
				}
				return false;
			},
			trigger: function( data ) {
				var el = this || data;
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {
					leverageNative( el, "click" );
				}
				return true;
			},
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},
		beforeunload: {
			postDispatch: function( event ) {
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};
function leverageNative( el, type, expectSync ) {
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );
			if ( ( event.isTrigger & 1 ) && this[ type ] ) {
				if ( !saved.length ) {
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}
			} else if ( saved.length ) {
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );
				event.stopImmediatePropagation();
			}
		}
	} );
}
jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};
jQuery.Event = function( src, props ) {
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
		this.isDefaultPrevented = src.defaultPrevented ?
			returnTrue :
			returnFalse;
		this.target = src.target;
		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;
	} else {
		this.type = src;
	}
	if ( props ) {
		jQuery.extend( this, props );
	}
	this.timeStamp = src && src.timeStamp || Date.now();
	this[ jQuery.expando ] = true;
};
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,
	preventDefault: function() {
		var e = this.originalEvent;
		this.isDefaultPrevented = returnTrue;
		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;
		this.isPropagationStopped = returnTrue;
		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;
		this.isImmediatePropagationStopped = returnTrue;
		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}
		this.stopPropagation();
	}
};
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: function( event ) {
		var button = event.button;
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}
			if ( button & 2 ) {
				return 3;
			}
			if ( button & 4 ) {
				return 2;
			}
			return 0;
		}
		return event.which;
	}
}, jQuery.event.addProp );
jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {
		setup: function() {
			leverageNative( this, type, expectSync );
			return false;
		},
		trigger: function() {
			leverageNative( this, type );
			return true;
		},
		delegateType: delegateType
	};
} );
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,
		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );
jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );
var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	rnoInnerhtml = /<script|<style|<link/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {
		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}
	return elem;
}
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}
function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	if ( dest.nodeType !== 1 ) {
		return;
	}
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;
		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};
			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );
		dataUser.set( dest, udataCur );
	}
}
function domManip( collection, args, callback, ignored ) {
	args = concat.apply( [], args );
	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = typeof value === "function";
	if ( valueIsFunction ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			args[ 0 ] = value.call( this, index, self.html() );
			domManip( self, args, callback, ignored );
		} );
	}
	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;
		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;
			for ( ; i < l; i++ ) {
				node = fragment;
				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );
					if ( hasScripts ) {
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}
				callback.call( collection[ i ], node, i );
			}
			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;
				jQuery.map( scripts, restoreScript );
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {
						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								} );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}
	return collection;
}
function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;
	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}
		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}
	return elem;
}
jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );
		if ( isIE && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {
			destElements = getAll( clone );
			srcElements = getAll( elem );
			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				if ( destElements[ i ].nodeName.toLowerCase() === "textarea" ) {
					destElements[ i ].defaultValue = srcElements[ i ].defaultValue;
				}
			}
		}
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}
		return clone;
	},
	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;
		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );
jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},
	remove: function( selector ) {
		return remove( this, selector );
	},
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},
	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},
	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},
	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},
	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},
	empty: function() {
		var elem,
			i = 0;
		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
				elem.textContent = "";
			}
		}
		return this;
	},
	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},
	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
				value = jQuery.htmlPrefilter( value );
				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}
					elem = 0;
				} catch ( e ) {}
			}
			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},
	replaceWith: function() {
		var ignored = [];
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;
			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}
		}, ignored );
	}
} );
jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;
		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );
			push.apply( ret, elems.get() );
		}
		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
var getStyles = function( elem ) {
		var view = elem.ownerDocument.defaultView;
		if ( !view ) {
			view = window;
		}
		return view.getComputedStyle( elem );
	};
var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}
	ret = callback.call( elem );
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}
	return ret;
};
function curCSS( elem, name, computed ) {
	var ret;
	computed = computed || getStyles( elem );
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}
	}
	return ret !== undefined ?
		ret + "" :
		ret;
}
var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};
function vendorPropName( name ) {
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;
	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}
function finalPropName( name ) {
	var final = vendorProps[ name ];
	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}
var
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};
function setPositiveNumber( _elem, value, subtract ) {
	var matches = rcssNum.exec( value );
	return matches ?
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}
function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}
	for ( ; i < 4; i += 2 ) {
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}
		if ( !isBorderBox ) {
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}
	if ( !isBorderBox && computedVal >= 0 ) {
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) ) || 0;
	}
	return delta;
}
function getWidthOrHeight( elem, dimension, extra ) {
	var styles = getStyles( elem ),
		boxSizingNeeded = isIE || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,
		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}
	if ( ( isIE && isBorderBox || val === "auto" ) &&
		elem.getClientRects().length ) {
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}
	val = parseFloat( val ) || 0;
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,
			val
		)
	) + "px";
}
jQuery.extend( {
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},
	style: function( elem, name, value, extra ) {
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}
		var ret, type, hooks,
			origName = cssCamelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
		if ( value !== undefined ) {
			type = typeof value;
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );
				type = "number";
			}
			if ( value == null || value !== value ) {
				return;
			}
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( isAutoPx( origName ) ? "px" : "" );
			}
			if ( isIE && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {
				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}
		} else {
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
				return ret;
			}
			return style[ name ];
		}
	},
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = cssCamelCase( name ),
			isCustomProp = rcustomProp.test( name );
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );
jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},
		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = extra &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {
				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}
			return setPositiveNumber( elem, value, subtract );
		}
	};
} );
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},
				parts = typeof value === "string" ? value.split( " " ) : [ value ];
			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}
			return expanded;
		}
	};
	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );
jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;
			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;
				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}
				return map;
			}
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );
function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;
Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( isAutoPx( prop ) ? "px" : "" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];
		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];
		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}
		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};
Tween.prototype.init.prototype = Tween.prototype;
Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}
			result = jQuery.css( tween.elem, tween.prop, "" );
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};
jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};
jQuery.fx = Tween.prototype.init;
jQuery.fx.step = {};
var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;
function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}
		jQuery.fx.tick();
	}
}
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}
	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}
	return attrs;
}
function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
			return tween;
		}
	}
}
function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;
		anim.always( function() {
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}
	if ( isBox && elem.nodeType === 1 ) {
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}
	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}
	propTween = false;
	for ( prop in orig ) {
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				showHide( [ elem ], true );
			}
			anim.done( function() {
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}
function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;
	for ( index in props ) {
		name = cssCamelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}
		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}
		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}
function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				percent = 1 - ( remaining / animation.duration || 0 ),
				index = 0,
				length = animation.tweens.length;
			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}
			deferred.notifyWith( elem, [ animation, percent, remaining ] );
			if ( percent < 1 && length ) {
				return remaining;
			}
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;
	propFilter( props, animation.opts.specialEasing );
	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( typeof result.stop === "function" ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}
	jQuery.map( props, createTween, animation );
	if ( typeof animation.opts.start === "function" ) {
		animation.opts.start.call( elem, animation );
	}
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);
	return animation;
}
jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},
	tweener: function( props, callback ) {
		if ( typeof props === "function" ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}
		var prop,
			index = 0,
			length = props.length;
		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},
	prefilters: [ defaultPrefilter ],
	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );
jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			typeof speed === "function" && speed,
		duration: speed,
		easing: fn && easing || easing && typeof easing !== "function" && easing
	};
	if ( jQuery.fx.off ) {
		opt.duration = 0;
	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];
			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}
	opt.old = opt.complete;
	opt.complete = function() {
		if ( typeof opt.old === "function" ) {
			opt.old.call( this );
		}
		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};
	return opt;
};
jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;
		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}
		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );
			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;
			data.finish = true;
			jQuery.queue( this, type, [] );
			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}
			delete data.finish;
		} );
	}
} );
jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );
jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;
	fxNow = Date.now();
	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}
	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};
jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};
jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}
	inProgress = true;
	schedule();
};
jQuery.fx.stop = function() {
	inProgress = null;
};
jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	_default: 400
};
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";
	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};
var boolHook,
	attrHandle = jQuery.expr.attrHandle;
jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},
	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );
jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}
		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}
			elem.setAttribute( name, value + "" );
			return value;
		}
		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}
		ret = jQuery.find.attr( elem, name );
		return ret == null ? undefined : ret;
	},
	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( isIE && value === "radio" && nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},
	removeAttr: function( elem, value ) {
		var name,
			i = 0,
			attrNames = value && value.match( rnothtmlwhite );
		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;
	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();
		if ( !isXML ) {
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );
var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;
jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},
	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );
jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}
		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}
			return ( elem[ name ] = value );
		}
		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}
		return elem[ name ];
	},
	propHooks: {
		tabIndex: {
			get: function( elem ) {
				var tabindex = jQuery.find.attr( elem, "tabindex" );
				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}
				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}
				return -1;
			}
		}
	},
	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );
if ( isIE ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}
jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}
function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}
function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}
jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;
		if ( typeof value === "function" ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}
		classes = classesToArray( value );
		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}
		return this;
	},
	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;
		if ( typeof value === "function" ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}
		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}
		classes = classesToArray( value );
		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}
		return this;
	},
	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );
		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}
		if ( typeof value === "function" ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}
		return this.each( function() {
			var className, i, self, classNames;
			if ( isValidValue ) {
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );
				while ( ( className = classNames[ i++ ] ) ) {
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {
					dataPriv.set( this, "__className__", className );
				}
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},
	hasClass: function( selector ) {
		var className, elem,
			i = 0;
		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}
		return false;
	}
} );
var rreturn = /\r/g;
jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];
				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}
				ret = elem.value;
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}
				return ret == null ? "" : ret;
			}
			return;
		}
		valueIsFunction = typeof value === "function";
		return this.each( function( i ) {
			var val;
			if ( this.nodeType !== 1 ) {
				return;
			}
			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}
			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );
jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;
				if ( index < 0 ) {
					i = max;
				} else {
					i = one ? index : 0;
				}
				for ( ; i < max; i++ ) {
					option = options[ i ];
					if ( option.selected &&
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {
						value = jQuery( option ).val();
						if ( one ) {
							return value;
						}
						values.push( value );
					}
				}
				return values;
			},
			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;
				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
} );
var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;
function buildParams( prefix, obj, traditional, add ) {
	var name;
	if ( Array.isArray( obj ) ) {
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				add( prefix, v );
			} else {
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );
	} else if ( !traditional && toType( obj ) === "object" ) {
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}
	} else {
		add( prefix, obj );
	}
}
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {
			var value = typeof valueOrFunction === "function" ?
				valueOrFunction() :
				valueOrFunction;
			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};
	if ( a == null ) {
		return "";
	}
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );
	} else {
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}
	return s.join( "&" );
};
jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();
			if ( val == null ) {
				return null;
			}
			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}
			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	var base, parsed, scripts;
	if ( !context ) {
		context = document.implementation.createHTMLDocument( "" );
		base = context.createElement( "base" );
		base.href = document.location.href;
		context.head.appendChild( base );
	}
	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}
	parsed = buildFragment( [ data ], context, scripts );
	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}
	return jQuery.merge( [], parsed.childNodes );
};
jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};
		if ( position === "static" ) {
			elem.style.position = "relative";
		}
		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}
		if ( typeof options === "function" ) {
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}
		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};
jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}
		var rect, win,
			elem = this[ 0 ];
		if ( !elem ) {
			return;
		}
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}
		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			offset = elem.getBoundingClientRect();
		} else {
			offset = this.offset();
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;
			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;
	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}
			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}
			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);
			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
			return access( this, function( elem, type, value ) {
				var doc;
				if ( isWindow( elem ) ) {
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}
				return value === undefined ?
					jQuery.css( elem, type, extra ) :
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );
var
	_jQuery = window.jQuery,
	_$ = window.$;
jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}
	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}
	return jQuery;
};
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}
return jQuery;
} );