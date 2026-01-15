# Git Commit Message

## Commit Title:
```
feat: implement soft delete for products and refactor to 3-layer architecture
```

## Commit Description:
```
- Add soft delete functionality: products are hidden (status=0) instead of hard delete
- Implement auto-cleanup: cart automatically removes hidden/deleted products on GET
- Add status field logic: status=1 (active), status=0 (hidden), status=-1 (deleted)
- Refactor codebase to follow 3-layer architecture (Controller → Service → Repository)
- Fix critical bugs:
  * Product update/delete now works with hidden products using getOneById()
  * Cart repository methods now use helper functions consistently
- Update product queries to filter by status=1 (only active products)
- Update cart logic to check product status and return removal messages
- Update order creation to validate only active products
- Add comprehensive API documentation (API_ENDPOINTS.md, API_TEST_CURL.md)

Breaking changes:
- Product deletion now uses soft delete (status=0) instead of hard delete
- Cart GET endpoint now returns messages array for removed products
- Product queries only return active products (status=1) by default
```
