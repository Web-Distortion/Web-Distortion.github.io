/* simplelist.h
 * High level routines for dealing with text files (read-only) with an item per line.
 *
 * Ziproxy - the HTTP acceleration proxy
 * This code is under the following conditions:
 *
 * ---------------------------------------------------------------------
 * Copyright (c)2005-2014 Daniel Mealha Cabrita
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111 USA
 * ---------------------------------------------------------------------
 */

//To stop multiple inclusions.
#ifndef SRC_SIMPLELIST_H
#define SRC_SIMPLELIST_H

#include "strtables.h"

extern t_st_strtable *slist_create (const char* given_filename);
extern void slist_destroy (t_st_strtable *slist_table);
extern int slist_check_if_matches (t_st_strtable *slist_table, const char *strdata);

#endif

