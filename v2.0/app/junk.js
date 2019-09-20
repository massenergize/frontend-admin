
{/* 
                {tagCollections.map(tc => (
                  <div className={classes.field} key={tc.id}>
                    <FormControl className={classes.formControl}>
                      <Select2
                        multiple
                        displayEmpty
                        value={tagsSelected.filter(i => tc.tags.map(h => h.id).indexOf(i) > -1)}
                        onChange={this.handleFormDataChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => {
                          if (selected.length === 0) {
                            return (
                              <em>
                                Select
                                {` ${tc.name}`}
                              </em>
                            );
                          }
                          const names = selected.map(s => tags.filter(t => t.id === s)[0].name);
                          return tc.name + ': ' + names.join(', ');
                        }}
                        MenuProps={MenuProps}
                      >
                        {tc.tags.map(t => {
                          return (
                            <MenuItem key={t.id} value={t.id}>
                              <Checkbox
                                checked={tagsSelected.indexOf(t.id) > -1}
                                onChange={this.handleCheckBoxSelect}
                                value={'' + t.id}
                                name="tagsSelected"
                              />
                              <ListItemText primary={`${t.name}`} />
                            </MenuItem>
                          );
                        })}
                      </Select2>
                    </FormControl>
                  </div>
                ))} */}






                {/* 
                {tagCollections.map(tc => (
                  <div className={classes.field} key={tc.id}>
                    <FormControl className={classes.formControl}>
                      <Select2
                        multiple
                        displayEmpty
                        value={tagsSelected.filter(i => tc.tags.map(h => h.id).indexOf(i) > -1)}
                        onChange={this.handleFormDataChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => {
                          if (selected.length === 0) {
                            return (
                              <em>
                                Select
                                {` ${tc.name}`}
                              </em>
                            );
                          }
                          const names = selected.map(s => tags.filter(t => t.id === s)[0].name);
                          return tc.name + ': ' + names.join(', ');
                        }}
                        MenuProps={MenuProps}
                      >
                        {tc.tags.map(t => {
                          return (
                            <MenuItem key={t.id} value={t.id}>
                              <Checkbox
                                checked={tagsSelected.indexOf(t.id) > -1}
                                onChange={this.handleCheckBoxSelect}
                                value={'' + t.id}
                                name="tagsSelected"
                              />
                              <ListItemText primary={`${t.name}`} />
                            </MenuItem>
                          );
                        })}
                      </Select2>
                    </FormControl>
                  </div>
                ))} */}